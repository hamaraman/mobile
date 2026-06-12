import React, { useEffect } from 'react';

interface Props {
  location: { name: string; address: string; lat?: number; lng?: number };
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const MapSection: React.FC<Props> = ({ location }) => {
  useEffect(() => {
    // This is where you would initialize Kakao Map if the script is loaded
    // For now, we'll show a placeholder button to open in map apps
  }, [location]);

  const openKakaoMap = () => {
    const url = `https://map.kakao.com/link/search/${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  const openNaverMap = () => {
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(location.address)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-12 px-6 space-y-6">
      <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center border border-wedding-accent/10">
        <p className="serif text-wedding-secondary italic">지도가 표시되는 영역입니다.</p>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={openKakaoMap}
          className="flex-1 py-3 border border-gray-200 rounded-md text-sm hover:bg-gray-50 transition-colors"
        >
          카카오맵 열기
        </button>
        <button 
          onClick={openNaverMap}
          className="flex-1 py-3 border border-gray-200 rounded-md text-sm hover:bg-gray-50 transition-colors"
        >
          네이버 지도 열기
        </button>
      </div>
    </section>
  );
};

export default MapSection;
