// POST /api/auth/logout — 세션 쿠키를 만료시킨다.
// Cloudflare Pages Function.

import { clearCookie, COOKIES } from '../../_shared/auth.js';

export async function onRequestPost() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearCookie(COOKIES.SESSION),
    },
  });
}
