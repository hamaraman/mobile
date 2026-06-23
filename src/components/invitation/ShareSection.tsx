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
    <section
      className="py-16 px-6 flex flex-col items-center gap-8"
      style={{ background: 'var(--t-section-bg, #FAF9F7)' }}
    >
      {shareUrl ? (
        <div className="w-full max-w-xs space-y-4 text-center">
          <p className="text-[9px] tracking-[0.45em] text-wedding-accent uppercase">Share</p>
          <p className="text-[11px] tracking-wide text-wedding-secondary/65">이 청첩장을 소중한 분들께 전해보세요.</p>
          <div className="flex items-center gap-2 border border-wedding-accent/25 px-4 py-3">
            <LinkIcon className="w-3.5 h-3.5 text-wedding-secondary/40 shrink-0" />
            <input
              readOnly
              value={shareUrl}
              onFocus={e => e.currentTarget.select()}
              className="flex-1 bg-transparent text-[11px] outline-none text-wedding-secondary/65 truncate"
            />
            <button
              onClick={copy}
              className="text-[10px] tracking-[0.2em] text-wedding-accent hover:text-wedding-primary transition-colors whitespace-nowrap uppercase"
            >
              복사
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[11px] tracking-wide text-wedding-secondary/45 text-center">
          발행하면 이 자리에 공유 링크가 표시됩니다.
        </p>
      )}

      <div className="w-full flex items-center gap-4 max-w-xs">
        <div className="flex-1 h-px bg-wedding-accent/20" />
        <p className="text-[9px] tracking-widest text-wedding-secondary/35 whitespace-nowrap">
          {data.groom.name} &amp; {data.bride.name}
        </p>
        <div className="flex-1 h-px bg-wedding-accent/20" />
      </div>

      <p className="text-[9px] tracking-widest text-wedding-secondary/30">
        © {new Date().getFullYear()} All rights reserved.
      </p>
    </section>
  );
};

export default ShareSection;
