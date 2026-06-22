import React from 'react';
import type { WeddingData } from '../../types/wedding';
import { Link as LinkIcon } from 'lucide-react';
import { useToast } from '../../hooks/toastContext';

interface Props {
  data: WeddingData;
}

const ShareSection: React.FC<Props> = ({ data }) => {
  const { toast } = useToast();

  // 발행된 청첩장(?id=xxx)일 때만 공유 링크가 의미가 있다. 편집기 미리보기에서는
  // 아직 링크가 없으므로 안내 문구만 보여준다.
  const id = new URLSearchParams(window.location.search).get('id');
  const shareUrl = id ? window.location.href : null;

  const copy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast('링크가 복사되었습니다.');
    } catch {
      toast('복사에 실패했습니다.', 'error');
    }
  };

  return (
    <section className="py-12 px-6 bg-white flex flex-col items-center gap-6">
      {shareUrl ? (
        <div className="w-full max-w-xs space-y-3 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-wedding-accent font-bold">Share</p>
          <p className="text-sm text-gray-500">이 청첩장을 소중한 분들께 전해보세요.</p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              readOnly
              value={shareUrl}
              onFocus={e => e.currentTarget.select()}
              className="flex-1 bg-transparent text-xs outline-none text-gray-600 truncate"
            />
            <button onClick={copy} className="text-xs font-bold text-wedding-accent whitespace-nowrap">
              복사
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center">발행하면 이 자리에 공유 링크가 표시됩니다.</p>
      )}

      <p className="text-xs text-gray-400 mt-4">
        Copyright © {new Date().getFullYear()} {data.groom.name} & {data.bride.name}. All rights reserved.
      </p>
    </section>
  );
};

export default ShareSection;
