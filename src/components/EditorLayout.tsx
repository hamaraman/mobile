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
  publishLabel?: string;   // 수정 모드에서 '수정 저장' 등으로 덮어쓴다.
}

type DeviceType = 'iphone' | 'galaxy';

const EditorLayout: React.FC<Props> = ({ data, onChange, onPublish, isSubmitting, autoSaved, onBack, publishLabel }) => {
  const [mobilePreview, setMobilePreview] = useState(false);
  const [device, setDevice] = useState<DeviceType>('iphone');

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
            {isSubmitting ? '저장 중…' : (publishLabel || '공유하기')}
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
          <EditorPanel data={data} onChange={onChange} onPublish={onPublish} isSubmitting={isSubmitting} publishLabel={publishLabel} />
        </aside>

        {/* 중앙: 도트 텍스처 + 폰 목업 */}
        <main
          className={`${mobilePreview ? 'flex' : 'hidden'} lg:flex flex-1 flex-col items-center overflow-y-auto pt-6 pb-16 bg-dot-texture`}
        >
          {/* 기기 토글 (아이폰 17 Pro ↔ 갤럭시 S25 Ultra) */}
          <div
            className="mb-5 inline-flex p-1 rounded-full border"
            style={{ background: '#FFFDF9', borderColor: '#E8E0D2' }}
          >
            {(['iphone', 'galaxy'] as DeviceType[]).map(kind => {
              const active = device === kind;
              const label = kind === 'iphone' ? 'iPhone 17 Pro' : 'Galaxy S25 Ultra';
              return (
                <button
                  key={kind}
                  onClick={() => setDevice(kind)}
                  className="text-xs px-3.5 py-1.5 rounded-full transition-colors"
                  style={{
                    background: active ? '#3A342D' : 'transparent',
                    color: active ? '#FFFDF9' : '#9A8F80',
                    fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center">
            {device === 'iphone' ? (
              /* iPhone 17 Pro — Dynamic Island */
              <div
                className="relative rounded-[3rem] overflow-hidden border-[8px] shadow-2xl flex-shrink-0"
                style={{
                  width: '375px',
                  height: '812px',
                  borderColor: '#1A1714',
                  background: '#FBF8F2',
                }}
              >
                {/* 다이나믹 아일랜드 */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 z-20"
                  style={{
                    top: '10px',
                    width: '112px',
                    height: '30px',
                    background: '#1A1714',
                    borderRadius: '9999px',
                  }}
                />
                {/* 상태바 시간 */}
                <div className="absolute top-2.5 left-7 text-[11px] font-semibold z-20" style={{ color: '#1A1714' }}>9:41</div>
                {/* 상태바 우측 아이콘(간단 표기) */}
                <div className="absolute top-2.5 right-7 flex items-center gap-1 z-20" style={{ color: '#1A1714' }}>
                  <span className="text-[10px] font-medium">100%</span>
                  <span
                    className="inline-block rounded-[3px] border"
                    style={{ width: '18px', height: '9px', borderColor: '#1A1714' }}
                  >
                    <span className="block h-full rounded-[2px]" style={{ background: '#1A1714', width: '100%' }} />
                  </span>
                </div>

                {/* 청첩장 본문 */}
                <div className="w-full h-full overflow-y-auto" style={{ paddingTop: '52px' }}>
                  <InvitationView data={data} isPreview />
                </div>
              </div>
            ) : (
              /* Galaxy S25 Ultra — 펀치홀 + 각진 코너 */
              <div
                className="relative rounded-[2.25rem] overflow-hidden border-[5px] shadow-2xl flex-shrink-0"
                style={{
                  width: '360px',
                  height: '820px',
                  borderColor: '#0E0E10',
                  background: '#FBF8F2',
                }}
              >
                {/* 펀치홀 카메라 */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 z-20 rounded-full"
                  style={{
                    top: '10px',
                    width: '11px',
                    height: '11px',
                    background: '#0E0E10',
                    boxShadow: '0 0 0 1.5px #1F1F22',
                  }}
                />
                {/* 상태바 시간 */}
                <div className="absolute top-2 left-6 text-[11px] font-semibold z-20" style={{ color: '#1A1714' }}>9:41</div>
                {/* 상태바 우측 아이콘 */}
                <div className="absolute top-2 right-6 flex items-center gap-1 z-20" style={{ color: '#1A1714' }}>
                  <span className="text-[10px] font-medium">100%</span>
                  <span
                    className="inline-block rounded-[3px] border"
                    style={{ width: '18px', height: '9px', borderColor: '#1A1714' }}
                  >
                    <span className="block h-full rounded-[2px]" style={{ background: '#1A1714', width: '100%' }} />
                  </span>
                </div>

                {/* 청첩장 본문 */}
                <div className="w-full h-full overflow-y-auto" style={{ paddingTop: '32px' }}>
                  <InvitationView data={data} isPreview />
                </div>
              </div>
            )}

            <p
              className="mt-4 text-xs italic"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#9A8F80' }}
            >
              {device === 'iphone' ? 'iPhone 17 Pro Preview' : 'Galaxy S25 Ultra Preview'}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorLayout;
