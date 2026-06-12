import React, { useEffect } from 'react';
import type { WeddingData } from '../../types/wedding';
import { Share2, MessageCircle } from 'lucide-react';

interface Props {
  data: WeddingData;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

const ShareSection: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized() && data.kakaoApiKey) {
      window.Kakao.init(data.kakaoApiKey);
    }
  }, [data.kakaoApiKey]);

  const shareKakao = () => {
    if (!window.Kakao) {
      alert('카카오톡 공유 기능을 불러올 수 없습니다.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      alert('카카오 API 키가 설정되지 않았습니다.');
      return;
    }

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: `${data.groom.name} & ${data.bride.name} 결혼합니다`,
        description: `${data.location.name} | ${data.weddingDate}`,
        imageUrl: data.galleryImages[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  const shareLink = () => {
    navigator.share?.({
      title: `${data.groom.name} & ${data.bride.name} 결혼식에 초대합니다`,
      url: window.location.href,
    }).catch(console.error);
  };

  return (
    <section className="py-12 px-6 bg-white flex flex-col items-center gap-6">
      <button 
        onClick={shareKakao}
        className="w-full max-w-xs flex items-center justify-center gap-2 bg-[#FEE500] text-[#3c1e1e] py-4 rounded-md font-medium shadow-sm hover:brightness-95 transition-all"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        카카오톡 공유하기
      </button>
      
      <button 
        onClick={shareLink}
        className="w-full max-w-xs flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-4 rounded-md font-medium hover:bg-gray-200 transition-all"
      >
        <Share2 className="w-5 h-5" />
        링크 복사하기
      </button>

      <p className="text-xs text-gray-400 mt-4">
        Copyright © {new Date().getFullYear()} {data.groom.name} & {data.bride.name}. All rights reserved.
      </p>
    </section>
  );
};

export default ShareSection;
