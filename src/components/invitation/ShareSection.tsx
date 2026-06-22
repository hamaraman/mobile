import React, { useEffect } from 'react';
import type { WeddingData } from '../../types/wedding';
import { Share2, MessageCircle } from 'lucide-react';
import { useToast } from '../../hooks/toastContext';

interface Props {
  data: WeddingData;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

// 카카오 JavaScript 키. 빌드 시 .env의 VITE_KAKAO_KEY로 주입되며,
// 미설정 시 기본 공개 키를 사용한다. 이 키는 클라이언트 번들에 노출되는 공개 JS 키라 비밀이 아니다.
const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY || '35a6b3e9d3e47ea098f206c51459dbd9';

const ShareSection: React.FC<Props> = ({ data }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized() && KAKAO_KEY) {
      window.Kakao.init(KAKAO_KEY);
    }
  }, []);

  const shareKakao = () => {
    if (!window.Kakao) {
      toast('카카오톡 공유 기능을 불러올 수 없습니다.', 'error');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      toast('카카오 API 키가 설정되지 않았습니다.', 'error');
      return;
    }

    // Kakao scrapes the image URL server-side, so base64 data URLs won't work —
    // prefer an external gallery URL, otherwise fall back to the hosted OG image.
    const externalImage = data.galleryImages.find(img => img.startsWith('http'));
    const imageUrl = externalImage || `${window.location.origin}/og-image.png`;

    const d = data.weddingDate ? new Date(data.weddingDate) : null;
    const dateText = d && !isNaN(d.getTime())
      ? d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
      : data.weddingDate;
    const description = [dateText, data.weddingTime, data.location.name].filter(Boolean).join(' · ');

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${data.groom.name} & ${data.bride.name} 결혼합니다`,
          description,
          imageUrl,
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
    } catch (e) {
      console.error('Kakao share error:', e);
      toast('카카오톡 공유 중 오류가 발생했습니다.', 'error');
    }
  };

  const shareLink = async () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${data.groom.name} & ${data.bride.name} 결혼식에 초대합니다`, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      toast('링크가 복사되었습니다.');
    }
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
