// GET /api/auth/kakao — 카카오 로그인 시작. CSRF용 state를 쿠키에 심고
// 카카오 인가 페이지로 302 리다이렉트한다.
// Cloudflare Pages Function.

import { stateCookie } from '../../_shared/auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.KAKAO_REST_KEY) {
    return new Response('KAKAO_REST_KEY가 설정되지 않았습니다.', { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/kakao/callback`;
  const state = crypto.randomUUID();

  const authUrl = new URL('https://kauth.kakao.com/oauth/authorize');
  authUrl.searchParams.set('client_id', env.KAKAO_REST_KEY);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      'Set-Cookie': stateCookie(state),
    },
  });
}
