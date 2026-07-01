// GET    /api/invitations/:id — ID로 청첩장 조회 (공개)
// PUT    /api/invitations/:id — 소유자(로그인) 또는 편집 토큰 일치 시 수정
// DELETE /api/invitations/:id — 소유자 본인만 삭제
// Cloudflare Pages Function. KV 바인딩 이름: INVITATIONS

import { getUser } from '../../_shared/auth.js';

const MAX_BYTES = 5 * 1024 * 1024;

export async function onRequestGet(context) {
  const { env, params } = context;
  if (!env.INVITATIONS) {
    return Response.json({ error: 'KV(INVITATIONS) 바인딩이 설정되지 않았습니다.' }, { status: 500 });
  }
  const raw = await env.INVITATIONS.get(params.id);
  if (!raw) {
    return Response.json({ error: '청첩장을 찾을 수 없습니다.' }, { status: 404 });
  }
  const record = JSON.parse(raw);
  // 편집 토큰은 절대 노출하지 않는다.
  return Response.json({ data: record.data, createdAt: record.createdAt });
}

export async function onRequestPut(context) {
  const { request, env, params } = context;
  if (!env.INVITATIONS) {
    return Response.json({ error: 'KV(INVITATIONS) 바인딩이 설정되지 않았습니다.' }, { status: 500 });
  }
  const raw = await env.INVITATIONS.get(params.id);
  if (!raw) {
    return Response.json({ error: '청첩장을 찾을 수 없습니다.' }, { status: 404 });
  }
  const record = JSON.parse(raw);

  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BYTES) {
      return Response.json({ error: '데이터가 너무 큽니다(5MB 초과).' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  // 권한: 소유자 본인(로그인) 이거나, (하위 호환) 편집 토큰이 일치하면 허용.
  const user = await getUser(request, env);
  const isOwner = !!user && record.ownerId && user.uid === record.ownerId;
  const hasToken = body.editToken && body.editToken === record.editToken;
  if (!isOwner && !hasToken) {
    return Response.json({ error: '편집 권한이 없습니다.' }, { status: 403 });
  }
  if (!body.data || !body.data.groom || !body.data.bride) {
    return Response.json({ error: '청첩장 데이터가 올바르지 않습니다.' }, { status: 400 });
  }

  record.data = body.data;
  record.updatedAt = Date.now();
  await env.INVITATIONS.put(params.id, JSON.stringify(record));

  return Response.json({ ok: true });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;
  if (!env.INVITATIONS) {
    return Response.json({ error: 'KV(INVITATIONS) 바인딩이 설정되지 않았습니다.' }, { status: 500 });
  }
  const raw = await env.INVITATIONS.get(params.id);
  if (!raw) {
    return Response.json({ error: '청첩장을 찾을 수 없습니다.' }, { status: 404 });
  }
  const record = JSON.parse(raw);

  const user = await getUser(request, env);
  if (!user || !record.ownerId || user.uid !== record.ownerId) {
    return Response.json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
  }

  await env.INVITATIONS.delete(params.id);

  // 사용자 인덱스에서도 제거
  const key = `user:${user.uid}`;
  try {
    const userRec = JSON.parse((await env.INVITATIONS.get(key)) || 'null');
    if (userRec && Array.isArray(userRec.invitations)) {
      userRec.invitations = userRec.invitations.filter(x => x !== params.id);
      await env.INVITATIONS.put(key, JSON.stringify(userRec));
    }
  } catch { /* 인덱스 손상 시 무시 */ }

  return Response.json({ ok: true });
}
