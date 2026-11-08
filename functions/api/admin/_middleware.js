// Guards every /api/admin/* route: needs the ADMIN_TOKEN secret as a Bearer token.
export function authorized(request, env) {
  const token = env.ADMIN_TOKEN || '';
  if (token.length < 12) return false; // unset or too weak: admin stays locked
  const got = (request.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (got.length !== token.length) return false;
  let diff = 0; // constant-time compare, so the token cannot be guessed char by char from timing
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

const unauthorized = () =>
  new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function onRequest({ request, env, next }) {
  if (!authorized(request, env)) return unauthorized();
  return next();
}

