// GET /api/invitations/:id/og — 청첩장 대표 사진(갤러리 첫 장)을 실제 이미지로 응답한다.
// 카카오톡/메신저 미리보기는 base64 data URL을 스크랩하지 못하므로,
// KV에 저장된 base64 사진을 디코딩해 진짜 이미지(image/jpeg 등)로 내보낸다.
// Cloudflare Pages Function. KV 바인딩 이름: INVITATIONS

// data URL("data:image/jpeg;base64,XXXX")을 {mime, bytes}로 디코딩한다.
function decodeDataUrl(dataUrl) {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) return null;
  const mime = match[1] || 'application/octet-stream';
  const isBase64 = Boolean(match[2]);
  const payload = match[3];
  if (!isBase64) {
    return { mime, bytes: new TextEncoder().encode(decodeURIComponent(payload)) };
  }
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { mime, bytes };
}

export async function onRequestGet(context) {
  const { env, params, request } = context;
  const fallback = () => Response.redirect(new URL('/og-image.png', request.url).toString(), 302);

  if (!env.INVITATIONS) return fallback();

  const raw = await env.INVITATIONS.get(params.id);
  if (!raw) return fallback();

  let record;
  try {
    record = JSON.parse(raw);
  } catch {
    return fallback();
  }

  const first = record?.data?.galleryImages?.[0];
  if (!first) return fallback();

  // 이미 외부 http(s) URL이면 그대로 그쪽으로 보낸다.
  if (/^https?:\/\//.test(first)) {
    return Response.redirect(first, 302);
  }

  const decoded = decodeDataUrl(first);
  if (!decoded) return fallback();

  return new Response(decoded.bytes, {
    headers: {
      'Content-Type': decoded.mime,
      // 청첩장 사진은 거의 바뀌지 않으므로 길게 캐시한다.
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
