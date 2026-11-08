// Admin API for the feedback inbox (page: /admin). Auth is in ./_middleware.js.
//   GET   /api/admin/feedback            -> { items: [...] } newest first
//   PATCH /api/admin/feedback {id,status} -> { ok: true }
const STATUSES = ['new', 'read', 'done'];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function onRequestGet({ env }) {
  // shortcut: newest 500 only, filtered in the browser; add paging when the inbox grows past that
  const { results } = await env.DB.prepare(
    'SELECT id, created_at, type, message, contact, status FROM feedback ORDER BY id DESC LIMIT 500',
  ).all();
  return json({ items: results });
}

export async function onRequestPatch({ request, env }) {
  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!Number.isInteger(id) || !STATUSES.includes(body?.status)) return json({ ok: false, error: 'bad_request' }, 400);
  await env.DB.prepare('UPDATE feedback SET status = ? WHERE id = ?').bind(body.status, id).run();
  return json({ ok: true });
}
