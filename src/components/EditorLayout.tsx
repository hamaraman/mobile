import React, { useState } from 'react';
import type { WeddingData } from '../types/wedding';
import InvitationView from './invitation/InvitationView';
import EditorPanel from './form/EditorPanel';

interface Props {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
  onPublish: (data: WeddingData) => void;
  isSubmitting: boolean;
  autoSaved: boolean;
  onBack: () => void;
}

const EditorLayout: React.FC<Props> = ({ data, onChange, onPublish, isSubmitting, autoSaved, onBack }) => {
  const [mobilePreview, setMobilePreview] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#F4F0E8' }}>
      {/* 상단 바 */}
      <header
        className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0 z-10"
        style={{
          background: '#FFFDF9',
          borderColor: '#E8E0D2',
          minHeight: '52px',
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
          style={{ color: '#9A8F80' }}
        >
          ← <span className="hidden sm:inline">나가기</span>
        </button>

        <span
          className="text-sm font-medium tracking-wide"
          style={{ color: '#3A342D', fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}
        >
          청첩장 편집
        </span>

        <div className="flex items-center gap-3">
          {/* 자동 저장 표시 */}
          <span
            className="hidden sm:flex items-center gap-1.5 text-xs"
            style={{ color: autoSaved ? '#8C9E76' : '#A89C8C' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: autoSaved ? '#8C9E76' : '#C9A36B' }}
            />
            {autoSaved ? '자동 저장됨' : '저장 중…'}
          </span>

          {/* 모바일: 미리보기 토글 */}
          <button
            className="lg:hidden text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: '#C9A36B',
              color: '#C9A36B',
              background: mobilePreview ? '#C9A36B10' : 'transparent',
            }}
            onClick={() => setMobilePreview(v => !v)}
          >
            {mobilePreview ? '편집' : '미리보기'}
          </button>

          <button
            onClick={() => onPublish(data)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: '#3A342D',
              color: '#fff',
              fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
            }}
          >
            {isSubmitting ? '발행 중…' : '공유하기'}
          </button>
        </div>
      </header>

      {/* 3분할 바디 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측 패널 (392px, 스크롤) */}
        <aside
          className={`${mobilePreview ? 'hidden' : 'flex'} lg:flex flex-col overflow-y-auto flex-shrink-0`}
          style={{
            width: '392px',
            background: '#FFFDF9',
            borderRight: '1px solid #E8E0D2',
          }}
        >
          <EditorPanel data={data} onChange={onChange} onPublish={onPublish} isSubmitting={isSubmitting} />
        </aside>

        {/* 중앙: 도트 텍스처 + 폰 목업 */}
        <main
          className={`${mobilePreview ? 'flex' : 'hidden'} lg:flex flex-1 items-start justify-center overflow-y-auto pt-10 pb-16 bg-dot-texture`}
        >
          <div className="flex flex-col items-center">
            {/* 폰 목업 프레임 */}
            <div
              className="relative rounded-[3rem] overflow-hidden border-[8px] shadow-2xl flex-shrink-0"
              style={{
                width: '375px',
                height: '812px',
                borderColor: '#1A1714',
                background: '#FBF8F2',
              }}
            >
              {/* 노치 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1A1714] rounded-b-2xl z-20" />
              {/* 상태바 시간 */}
              <div className="absolute top-1.5 left-8 text-[10px] font-medium z-20" style={{ color: '#1A1714' }}>9:41</div>

              {/* 청첩장 본문 */}
              <div className="w-full h-full overflow-y-auto" style={{ paddingTop: '24px' }}>
                <InvitationView data={data} isPreview />
              </div>
            </div>

            <p
              className="mt-4 text-xs italic"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#9A8F80' }}
            >
              Mobile Preview
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorLayout;
