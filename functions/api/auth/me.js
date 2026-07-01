// GET /api/auth/me — 현재 로그인 사용자 정보. 미로그인이면 { user: null }.
// Cloudflare Pages Function.

import { getUser } from '../../_shared/auth.js';

export async function onRequestGet(context) {
  const user = await getUser(context.request, context.env);
  return Response.json({ user });
}
