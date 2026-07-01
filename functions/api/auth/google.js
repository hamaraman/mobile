// GET /api/auth/google — 구글 로그인 시작. CSRF용 state를 쿠키에 심고
// 구글 OAuth 동의 화면으로 302 리다이렉트한다.
// Cloudflare Pages Function.

import { stateCookie } from '../../_shared/auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;

  if (!env.GOOGLE_CLIENT_ID) {
    return new Response('GOOGLE_CLIENT_ID가 설정되지 않았습니다.', { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  const state = crypto.randomUUID();

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  // 항상 계정 선택 화면을 보여줘 여러 계정 전환을 쉽게 한다.
  authUrl.searchParams.set('prompt', 'select_account');

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      'Set-Cookie': stateCookie(state),
    },
  });
}
