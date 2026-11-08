// POST /api/feedback: saves a suggestion from the landing page form into D1 (binding DB).
const TYPES = ['idea', 'bug', 'other'];
const MAX_PER_HOUR = 5;

export function validate(body) {
  if (!body || typeof body !== 'object') return { error: 'bad_request' };
  // honeypot: a hidden field people never see, bots fill it in
  if (body.website) return { spam: true };
  const type = String(body.type || '');
  const message = String(body.message || '').trim();
  const contact = String(body.contact || '').trim();
  if (!TYPES.includes(type)) return { error: 'type' };
  if (message.length < 5 || message.length > 1000) return { error: 'message' };
  if (contact.length > 120) return { error: 'contact' };
  return { type, message, contact: contact || null };
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const TYPE_LABEL = { idea: '💡 เสนอฟีเจอร์', bug: '🐞 แจ้งปัญหา', other: '💬 ความคิดเห็น' };

// Push a LINE message from the P'Hook OA to the admins. Skipped until both secrets are set.
async function notifyAdmins(env, v, origin) {
  const ids = (env.ADMIN_LINE_USER_IDS || '').split(',').map((x) => x.trim()).filter(Boolean);
  if (!env.LINE_CHANNEL_ACCESS_TOKEN || !ids.length) return;
  const text = [
    `ข้อเสนอแนะใหม่ · ${TYPE_LABEL[v.type]}`,
    '',
    v.message,
    v.contact ? `\nติดต่อกลับ: ${v.contact}` : '',
    `\nดูทั้งหมด: ${origin}/admin`,
  ].join('\n');
  const res = await fetch('https://api.line.me/v2/bot/message/multicast', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}` },
    body: JSON.stringify({ to: ids, messages: [{ type: 'text', text }] }),
  });
  if (!res.ok) console.log('LINE notify failed', res.status, await res.text());
}

export async function onRequestPost({ request, env, waitUntil }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  const v = validate(body);
  if (v.spam) return json({ ok: true }); // look successful so bots do not retry
  if (v.error) return json({ ok: false, error: v.error }, 400);

  // store only a hash of the IP, enough to rate-limit without keeping the address
  const ipHash = await sha256(request.headers.get('CF-Connecting-IP') || 'unknown');
  // shortcut: count-then-insert can let a burst slip 1-2 over the limit; fine for a feedback form
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM feedback WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
  ).bind(ipHash).first('n');
  if (recent >= MAX_PER_HOUR) return json({ ok: false, error: 'too_many' }, 429);

  await env.DB.prepare('INSERT INTO feedback (type, message, contact, ip_hash) VALUES (?, ?, ?, ?)')
    .bind(v.type, v.message, v.contact, ipHash)
    .run();
  // after the response, so a LINE outage never blocks or loses a submission
  waitUntil(notifyAdmins(env, v, new URL(request.url).origin).catch((e) => console.log('LINE notify error', e)));
  return json({ ok: true });
}
