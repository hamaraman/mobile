// GET  /api/invitations/:id — ID로 청첩장 조회 (공개)
// PUT  /api/invitations/:id — 편집 토큰이 일치하면 수정
// Cloudflare Pages Function. KV 바인딩 이름: INVITATIONS

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

  if (body.editToken !== record.editToken) {
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
