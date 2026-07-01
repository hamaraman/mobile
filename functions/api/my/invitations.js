// GET /api/my/invitations — 로그인 사용자가 소유한 청첩장 요약 목록.
// 사진(base64)은 제외하고 목록 표시에 필요한 필드만 반환한다.
// Cloudflare Pages Function. KV 바인딩 이름: INVITATIONS

import { getUser } from '../../_shared/auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.INVITATIONS) {
    return Response.json({ error: 'KV(INVITATIONS) 바인딩이 설정되지 않았습니다.' }, { status: 500 });
  }

  const user = await getUser(request, env);
  if (!user) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  let userRec;
  try {
    userRec = JSON.parse((await env.INVITATIONS.get(`user:${user.uid}`)) || 'null');
  } catch {
    userRec = null;
  }
  const ids = userRec && Array.isArray(userRec.invitations) ? userRec.invitations : [];

  const items = await Promise.all(ids.map(async (id) => {
    const raw = await env.INVITATIONS.get(id);
    if (!raw) return null;
    let rec;
    try {
      rec = JSON.parse(raw);
    } catch {
      return null;
    }
    const d = rec.data || {};
    return {
      id,
      groomName: d.groom?.name || '',
      brideName: d.bride?.name || '',
      weddingDate: d.weddingDate || '',
      updatedAt: rec.updatedAt || rec.createdAt || 0,
    };
  }));

  // 존재하지 않는(삭제된) 항목 제거 후 최근 수정순 정렬
  const list = items.filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt);
  return Response.json({ invitations: list });
}
