// POST /api/invitations — 새 청첩장을 저장하고 고유 ID와 편집 토큰을 발급한다.
// 로그인 필수: 발행자는 세션으로 인증되고, 청첩장에 소유자(ownerId)가 기록된다.
// Cloudflare Pages Function. KV 바인딩 이름: INVITATIONS

import { getUser } from '../_shared/auth.js';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB 상한(사진 base64 대비)

function shortId() {
  // 충돌 가능성이 매우 낮은 10자리 base36 ID
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, b => b.toString(36).padStart(2, '0')).join('').slice(0, 10);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.INVITATIONS) {
    return Response.json({ error: 'KV(INVITATIONS) 바인딩이 설정되지 않았습니다.' }, { status: 500 });
  }

  // 로그인 필수
  const user = await getUser(request, env);
  if (!user) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  let data;
  try {
    const text = await request.text();
    if (text.length > MAX_BYTES) {
      return Response.json({ error: '데이터가 너무 큽니다(5MB 초과). 사진 용량을 줄여주세요.' }, { status: 413 });
    }
    data = JSON.parse(text);
  } catch {
    return Response.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  if (!data || typeof data !== 'object' || !data.groom || !data.bride) {
    return Response.json({ error: '청첩장 데이터가 올바르지 않습니다.' }, { status: 400 });
  }

  const id = shortId();
  const editToken = crypto.randomUUID();
  const record = { data, editToken, ownerId: user.uid, createdAt: Date.now(), updatedAt: Date.now() };

  await env.INVITATIONS.put(id, JSON.stringify(record));

  // 사용자 인덱스(user:<uid>)에 새 청첩장 id를 추가한다.
  const key = `user:${user.uid}`;
  let userRec;
  try {
    userRec = JSON.parse((await env.INVITATIONS.get(key)) || 'null');
  } catch {
    userRec = null;
  }
  if (!userRec || !Array.isArray(userRec.invitations)) {
    userRec = { name: user.name, invitations: [], createdAt: Date.now() };
  }
  userRec.invitations.push(id);
  await env.INVITATIONS.put(key, JSON.stringify(userRec));

  return Response.json({ id, editToken });
}
