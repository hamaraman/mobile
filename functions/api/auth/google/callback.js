// GET /api/auth/google/callback — 구글 인가 코드를 받아 토큰을 교환하고
// 사용자 정보를 조회한 뒤 세션 쿠키를 발급하고 /?mine 으로 돌려보낸다.
// Cloudflare Pages Function. KV 바인딩: INVITATIONS

import { parseCookies, signSession, sessionCookie, clearCookie, COOKIES } from '../../../_shared/auth.js';

// 오류 시 로그인 화면으로 되돌리며 사유를 쿼리로 전달
function fail(origin, reason) {
  return Response.redirect(`${origin}/?login=error&reason=${encodeURIComponent(reason)}`, 302);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = url.origin;

  // 구글은 confidential 클라이언트라 Client Secret이 항상 필요하다.
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.SESSION_SECRET) {
    return fail(origin, '서버 환경변수 미설정');
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code) return fail(origin, '인가 코드 없음');

  // CSRF: 쿠키에 심어둔 state와 대조
  const cookies = parseCookies(request);
  if (!state || state !== cookies[COOKIES.STATE]) {
    return fail(origin, 'state 불일치');
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  // 1) 인가 코드 → 액세스 토큰
  const tokenParams = {
    grant_type: 'authorization_code',
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    code,
  };

  let tokenRes;
  try {
    tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: new URLSearchParams(tokenParams),
    });
  } catch {
    return fail(origin, '토큰 요청 실패');
  }
  if (!tokenRes.ok) return fail(origin, '토큰 교환 실패');
  const token = await tokenRes.json();
  const accessToken = token.access_token;
  if (!accessToken) return fail(origin, '액세스 토큰 없음');

  // 2) 액세스 토큰 → 사용자 정보(OpenID Connect userinfo)
  const meRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!meRes.ok) return fail(origin, '사용자 조회 실패');
  const me = await meRes.json();
  // sub는 구글 계정의 안정적 고유 ID.
  const uid = me.sub != null ? String(me.sub) : null;
  if (!uid) return fail(origin, '사용자 id 없음');
  const name = me.name || me.email || '구글 사용자';

  // 3) 사용자 레코드 최초 생성(있으면 이름만 갱신)
  if (env.INVITATIONS) {
    const key = `user:${uid}`;
    const existing = await env.INVITATIONS.get(key);
    if (!existing) {
      await env.INVITATIONS.put(key, JSON.stringify({ name, invitations: [], createdAt: Date.now() }));
    } else {
      try {
        const rec = JSON.parse(existing);
        if (rec.name !== name) {
          rec.name = name;
          await env.INVITATIONS.put(key, JSON.stringify(rec));
        }
      } catch { /* 손상된 레코드는 무시 */ }
    }
  }

  // 4) 세션 쿠키 발급 후 대시보드로
  const session = await signSession({ uid, name }, env.SESSION_SECRET);
  const headers = new Headers({ Location: `${origin}/?mine` });
  headers.append('Set-Cookie', sessionCookie(session));
  headers.append('Set-Cookie', clearCookie(COOKIES.STATE)); // 일회용 state 정리
  return new Response(null, { status: 302, headers });
}
