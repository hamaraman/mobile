import React from 'react';

interface Props {
  onStart: () => void;
}

const PHONE_PREVIEW = {
  groomName: '김도윤',
  brideName: '이서연',
  date: '2026 . 10 . 17',
  venue: '더채플앳논현',
};

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F4F0E8' }}
    >
      {/* 상단 로고 */}
      <header className="flex items-center gap-3 px-8 py-6">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ background: '#C9A36B', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}
        >
          D
        </div>
        <span
          className="text-sm tracking-wider"
          style={{ color: '#3A342D', fontFamily: 'Pretendard Variable, Pretendard, sans-serif', fontWeight: 500 }}
        >
          DODAM 모바일 청첩장
        </span>
      </header>

      {/* 메인 영역 */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-8 lg:px-20 py-12 max-w-6xl mx-auto w-full">

        {/* 좌측: 텍스트 */}
        <div className="flex-1 max-w-xl space-y-8">
          <div className="space-y-2">
            <p
              className="text-base italic"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A36B', letterSpacing: '0.05em' }}
            >
              make your own
            </p>
            <h1
              className="text-4xl lg:text-5xl leading-tight"
              style={{
                fontFamily: 'Gowun Batang, serif',
                color: '#3A342D',
                wordBreak: 'keep-all',
                lineHeight: 1.4,
              }}
            >
              5분이면 완성되는<br />우리의 모바일 청첩장
            </h1>
          </div>

          <p
            className="text-base leading-relaxed"
            style={{ color: '#9A8F80', fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}
          >
            이름과 날짜만 입력하면 감성적인 모바일 청첩장이 완성됩니다.
            카카오톡 링크 공유까지 한 번에.
          </p>

          <div className="space-y-3">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-sm font-medium tracking-wide transition-all hover:brightness-110 active:scale-95"
              style={{
                background: '#3A342D',
                fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
              }}
            >
              새 청첩장 만들기
              <span style={{ fontFamily: 'Cormorant Garamond, serif' }}>→</span>
            </button>
            <p
              className="text-xs pl-1"
              style={{ color: '#A89C8C' }}
            >
              회원가입 없이 바로 시작
            </p>
          </div>

          {/* 지표 3개 */}
          <div className="flex gap-8 pt-4">
            {[
              { value: '4', label: '감성 테마' },
              { value: '7', label: '구성 섹션' },
              { value: '5분', label: '평균 제작' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-2xl font-light"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A36B' }}
                >
                  {value}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: '#9A8F80' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 떠다니는 폰 목업 */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              transform: 'rotate(-4deg)',
              animation: 'floaty 4s ease-in-out infinite',
            }}
          >
            {/* 폰 외관 */}
            <div
              className="relative w-[220px] rounded-[2.5rem] overflow-hidden border-[7px] border-[#2A2320] shadow-2xl"
              style={{ aspectRatio: '9/19.5', background: '#FBF8F2' }}
            >
              {/* 노치 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#2A2320] rounded-b-2xl z-10" />

              {/* 청첩장 미리보기 */}
              <div className="w-full h-full flex flex-col items-center justify-center px-4 py-8 text-center">
                {/* WEDDING DAY 라벨 */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-px bg-[#C9A36B]/40" />
                  <span
                    className="text-[8px] tracking-widest"
                    style={{ color: '#C9A36B' }}
                  >
                    WEDDING DAY
                  </span>
                  <div className="w-6 h-px bg-[#C9A36B]/40" />
                </div>

                {/* 이름 */}
                <div className="space-y-1 mb-6">
                  <p
                    className="text-lg font-light tracking-widest"
                    style={{ fontFamily: 'Gowun Batang, serif', color: '#4A423A' }}
                  >
                    {PHONE_PREVIEW.groomName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A36B' }}
                  >
                    ✦
                  </p>
                  <p
                    className="text-lg font-light tracking-widest"
                    style={{ fontFamily: 'Gowun Batang, serif', color: '#4A423A' }}
                  >
                    {PHONE_PREVIEW.brideName}
                  </p>
                </div>

                <div className="w-8 h-px bg-[#C9A36B]/35 mb-5" />

                <p
                  className="text-[10px] tracking-widest"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#9A8F80' }}
                >
                  {PHONE_PREVIEW.date}
                </p>
                <p
                  className="text-[9px] tracking-wider mt-1 uppercase"
                  style={{ color: '#9A8F80' }}
                >
                  {PHONE_PREVIEW.venue}
                </p>

                {/* 하단 장식 */}
                <div className="absolute bottom-6 flex gap-1">
                  {['#C9A36B', '#C98A86', '#8C9E76', '#7A93AD'].map(c => (
                    <div key={c} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.6 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* 배경 글로우 */}
            <div
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-30"
              style={{ background: '#C9A36B', transform: 'scale(1.5)' }}
            />
          </div>
        </div>
      </main>

      {/* 하단 */}
      <footer className="text-center pb-8">
        <p
          className="text-[10px] tracking-widest"
          style={{ color: '#C9A36B', opacity: 0.5 }}
        >
          ELEGANCE IN EVERY DETAIL
        </p>
      </footer>

      <style>{`
        @keyframes floaty {
          0%, 100% { transform: rotate(-4deg) translateY(0px); }
          50% { transform: rotate(-4deg) translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
