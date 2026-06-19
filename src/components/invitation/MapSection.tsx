import React from 'react';

interface Props {
  location: { name: string; address: string; lat?: number; lng?: number };
}

const MapSection: React.FC<Props> = ({ location }) => {
  const query = location.lat && location.lng
    ? `${location.lat},${location.lng}`
    : encodeURIComponent(`${location.name} ${location.address}`);

  const src = `https://maps.google.com/maps?q=${query}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const openKakao = () =>
    window.open(`https://map.kakao.com/link/search/${encodeURIComponent(location.name || location.address)}`, '_blank');
  const openNaver = () =>
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(location.name || location.address)}`, '_blank');
  const openGoogle = () =>
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(`${location.name} ${location.address}`)}`, '_blank');

  return (
    <section className="py-12 px-6 space-y-4">
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
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

      <div className="flex gap-2">
        <button onClick={openKakao} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors text-wedding-primary">
          카카오맵
        </button>
        <button onClick={openNaver} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors text-wedding-primary">
          네이버 지도
        </button>
        <button onClick={openGoogle} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors text-wedding-primary">
          구글 지도
        </button>
      </div>
    </section>
  );
};

export default MapSection;
