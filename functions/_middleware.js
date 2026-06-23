// 공유 링크(/?id=xxx)로 들어온 HTML 요청에 청첩장별 Open Graph 태그를 심는다.
// 카카오톡 등 메신저 스크래퍼는 자바스크립트를 실행하지 않고 정적 HTML의 meta 태그만
// 읽으므로, 서버(엣지)에서 미리 갤러리 사진·신랑신부 이름을 og 태그에 주입해야
// 링크 미리보기에 청첩장 사진이 보인다.
// Cloudflare Pages Function. KV 바인딩 이름: INVITATIONS

// 지정한 property/name의 meta content를 통째로 바꾸는 HTMLRewriter 핸들러.
// HTMLRewriter의 setAttribute/setInnerContent가 직렬화 시 자동으로 이스케이프하므로
// 원본 문자열을 그대로 넘긴다.
class SetMetaContent {
  constructor(content) {
    this.content = content;
  }
  element(el) {
    el.setAttribute('content', this.content);
  }
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  // 루트 문서(/?id=xxx) 요청만 가로챈다. 그 외(정적 자산·API)는 그대로 통과.
  if (url.pathname !== '/' || !id || !env.INVITATIONS) {
    return next();
  }

  const response = await next();
  const contentType = response.headers.get('Content-Type') || '';
  if (!contentType.includes('text/html')) return response;

  const raw = await env.INVITATIONS.get(id);
  if (!raw) return response;

  let record;
  try {
    record = JSON.parse(raw);
  } catch {
    return response;
  }
  const data = record?.data;
  if (!data) return response;

  const groom = data.groom?.name || '';
  const bride = data.bride?.name || '';
  const names = [groom, bride].filter(Boolean).join(' ♥ ');
  const title = names ? `${names} 결혼합니다` : '모바일 청첩장';

  const d = data.weddingDate ? new Date(data.weddingDate) : null;
  const dateText = d && !isNaN(d.getTime())
    ? d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
    : data.weddingDate;
  const description =
    [dateText, data.weddingTime, data.location?.name].filter(Boolean).join(' · ') ||
    '소중한 분들을 결혼식에 모십니다.';

  // 갤러리 사진을 실제 이미지로 내보내는 엔드포인트(절대 URL). 사진을 교체하면
  // updatedAt이 바뀌므로 ?v=updatedAt을 붙여 메신저/CDN 캐시를 무력화한다.
  const hasImage = Array.isArray(data.galleryImages) && data.galleryImages.length > 0;
  const version = record.updatedAt || record.createdAt || '';
  const imageUrl = hasImage
    ? `${url.origin}/api/invitations/${encodeURIComponent(id)}/og?v=${version}`
    : `${url.origin}/og-image.png`;
  const canonicalUrl = `${url.origin}/?id=${encodeURIComponent(id)}`;

  return new HTMLRewriter()
    .on('title', {
      element(el) {
        el.setInnerContent(title);
      },
    })
    .on('meta[name="description"]', new SetMetaContent(description))
    .on('meta[property="og:url"]', new SetMetaContent(canonicalUrl))
    .on('meta[property="og:title"]', new SetMetaContent(title))
    .on('meta[property="og:description"]', new SetMetaContent(description))
    .on('meta[property="og:image"]', new SetMetaContent(imageUrl))
    .on('meta[name="twitter:title"]', new SetMetaContent(title))
    .on('meta[name="twitter:description"]', new SetMetaContent(description))
    .on('meta[name="twitter:image"]', new SetMetaContent(imageUrl))
    .transform(response);
}
