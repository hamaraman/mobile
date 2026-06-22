// POST /api/invitations — 새 청첩장을 저장하고 고유 ID와 편집 토큰을 발급한다.
// Cloudflare Pages Function. KV 바인딩 이름: INVITATIONS

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
  const record = { data, editToken, createdAt: Date.now(), updatedAt: Date.now() };

  await env.INVITATIONS.put(id, JSON.stringify(record));

  return Response.json({ id, editToken });
}
