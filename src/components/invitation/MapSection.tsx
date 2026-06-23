import React from 'react';

interface Props {
  location: { name: string; address: string; lat?: number; lng?: number };
}

const MapSection: React.FC<Props> = ({ location }) => {
  // 좌표가 있으면 좌표로, 없으면 주소로 검색한다. 장소명+주소를 한 문자열로 합치면
  // 구글 지오코더가 엉뚱한 곳을 잡거나 못 찾는 경우가 많아, 가장 정확한 주소를
  // 우선 쓰고 주소가 비어 있을 때만 장소명으로 폴백한다.
  const query = location.lat != null && location.lng != null
    ? `${location.lat},${location.lng}`
    : location.address || location.name;

  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=ko&output=embed`;

  const openKakao = () =>
    window.open(`https://map.kakao.com/link/search/${encodeURIComponent(location.name || location.address)}`, '_blank');
  const openNaver = () =>
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(location.name || location.address)}`, '_blank');

  return (
    <section className="px-6 pb-20 pt-4">
      <div
        className="w-full overflow-hidden border border-wedding-accent/20"
        style={{ height: 280 }}
      >
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="지도"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={openKakao}
          className="flex-1 py-3 text-[11px] tracking-[0.28em] border border-wedding-accent/25 text-wedding-secondary/75 hover:border-wedding-accent/50 hover:text-wedding-primary transition-colors"
        >
          카카오맵
        </button>
        <button
          onClick={openNaver}
          className="flex-1 py-3 text-[11px] tracking-[0.28em] border border-wedding-accent/25 text-wedding-secondary/75 hover:border-wedding-accent/50 hover:text-wedding-primary transition-colors"
        >
          네이버지도
        </button>
      </div>
    </section>
  );
};

export default MapSection;
