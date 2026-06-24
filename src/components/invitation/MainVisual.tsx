import React, { useState, useEffect } from 'react';
import type { WeddingData, DesignStyle } from '../../types/wedding';
import { motion } from 'framer-motion';

interface Props {
  data: WeddingData;
  design?: DesignStyle;
}

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

/* ── 디자인별 이름 사이 구분자 ── */
const NameSeparator: React.FC<{ design: DesignStyle }> = ({ design }) => {
  if (design === 'minimal') return (
    <div className="flex items-center justify-center gap-3 py-1">
      <div className="w-6 h-px" style={{ background: 'var(--color-wedding-accent)', opacity: 0.4 }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-wedding-accent)', opacity: 0.5 }} />
      <div className="w-6 h-px" style={{ background: 'var(--color-wedding-accent)', opacity: 0.4 }} />
    </div>
  );
  if (design === 'romantic') return (
    <div className="flex items-center justify-center py-2">
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style={{ color: 'var(--color-wedding-accent)', opacity: 0.7 }}>
        <path d="M16 12C16 12 10 4 4 8C7 14 16 12 16 12Z" fill="currentColor" />
        <path d="M16 12C16 12 22 4 28 8C25 14 16 12 16 12Z" fill="currentColor" />
        <path d="M16 12C16 12 10 20 4 16C7 10 16 12 16 12Z" fill="currentColor" opacity="0.5" />
        <path d="M16 12C16 12 22 20 28 16C25 10 16 12 16 12Z" fill="currentColor" opacity="0.5" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
      </svg>
    </div>
  );
  if (design === 'modern') return (
    <div className="flex items-center justify-center py-1">
      <span className="text-5xl font-light leading-none" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)' }}>
        &
      </span>
    </div>
  );
  // classic (default)
  return (
    <div className="flex items-center justify-center py-1">
      <span className="text-3xl" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)', fontStyle: 'italic' }}>
        &
      </span>
    </div>
  );
};

/* ── 디자인별 상단 레이블 ── */
const TopLabel: React.FC<{ design: DesignStyle }> = ({ design }) => {
  if (design === 'minimal') return (
    <div className="mb-10">
      <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: 'var(--color-wedding-accent)', opacity: 0.6 }}>
        Wedding Invitation
      </p>
    </div>
  );
  if (design === 'modern') return (
    <div className="mb-10">
      <div className="w-12 h-1 mx-auto mb-3" style={{ background: 'var(--color-wedding-accent)' }} />
      <p className="text-[11px] tracking-[0.4em] uppercase font-semibold" style={{ color: 'var(--color-wedding-primary)' }}>
        We're Getting Married
      </p>
    </div>
  );
  if (design === 'romantic') return (
    <div className="mb-10 space-y-2">
      <div className="flex items-center justify-center gap-2">
        {[0,1,2].map(i => <div key={i} className="w-1 h-1 rounded-full" style={{ background: 'var(--color-wedding-accent)', opacity: 0.5 }} />)}
      </div>
      <p className="text-[10px] tracking-[0.45em] italic" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)' }}>
        together with their families
      </p>
    </div>
  );
  // classic
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <div className="w-10 h-px" style={{ background: 'var(--color-wedding-accent)', opacity: 0.35 }} />
      <span className="text-[9px] tracking-[0.45em] font-light italic" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)' }}>
        the wedding of
      </span>
      <div className="w-10 h-px" style={{ background: 'var(--color-wedding-accent)', opacity: 0.35 }} />
    </div>
  );
};

/* ── 디자인별 이름 폰트 ── */
const nameStyle = (design: DesignStyle): React.CSSProperties => ({
  fontFamily: design === 'modern'
    ? 'Pretendard Variable, Pretendard, sans-serif'
    : 'Gowun Batang, serif',
  color: 'var(--color-wedding-primary, #4A423A)',
  letterSpacing: design === 'modern' ? '0.05em' : '0.15em',
  fontWeight: design === 'modern' ? 700 : 400,
});

const MainVisual: React.FC<Props> = ({ data, design = 'classic' }) => {
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  const date = data.weddingDate ? new Date(data.weddingDate) : null;
  const isValidDate = date && !isNaN(date.getTime());

  const dateDisplay = isValidDate
    ? `${date.getFullYear()} . ${String(date.getMonth() + 1).padStart(2, '0')} . ${String(date.getDate()).padStart(2, '0')}`
    : 'YYYY . MM . DD';

  const weekdayDisplay = isValidDate
    ? date.toLocaleDateString('ko-KR', { weekday: 'long' })
    : '';

  useEffect(() => {
    if (!data.weddingDate) return;
    const [h, m] = (data.weddingTime || '12:00').split(':').map(Number);
    const target = new Date(data.weddingDate);
    target.setHours(h, m, 0, 0);

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsPast(true);
        return;
      }
      setIsPast(false);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDate, data.weddingTime]);

  const heroPhoto = data.galleryImages[0];

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--t-main-bg, #FBF8F2)', minHeight: '100svh' }}
    >
      {/* 코너 브래킷 — 클래식만 */}
      {design === 'classic' && <>
        <div className="absolute top-8 left-8 w-10 h-10 border-t border-l pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent)', opacity: 0.4 }} />
        <div className="absolute top-8 right-8 w-10 h-10 border-t border-r pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent)', opacity: 0.4 }} />
        <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent)', opacity: 0.4 }} />
        <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent)', opacity: 0.4 }} />
      </>}

      {/* 모던 — 좌측 세로 라인 */}
      {design === 'modern' && (
        <div className="absolute left-6 top-1/4 bottom-1/4 w-px pointer-events-none" style={{ background: 'var(--color-wedding-accent)', opacity: 0.2 }} />
      )}

      {/* 로맨틱 — 배경 꽃잎 흔적 */}
      {design === 'romantic' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute top-6 right-6 opacity-10" width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ color: 'var(--color-wedding-accent)' }}>
            <path d="M40 10C40 10 25 25 40 40C55 25 40 10 40 10Z" fill="currentColor" />
            <path d="M70 40C70 40 55 25 40 40C55 55 70 40 70 40Z" fill="currentColor" />
            <path d="M40 70C40 70 55 55 40 40C25 55 40 70 40 70Z" fill="currentColor" />
            <path d="M10 40C10 40 25 55 40 40C25 25 10 40 10 40Z" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-8 left-6 opacity-8" width="60" height="60" viewBox="0 0 80 80" fill="none" style={{ color: 'var(--color-wedding-accent)' }}>
            <path d="M40 10C40 10 25 25 40 40C55 25 40 10 40 10Z" fill="currentColor" />
            <path d="M70 40C70 40 55 25 40 40C55 55 70 40 70 40Z" fill="currentColor" />
            <path d="M40 70C40 70 55 55 40 40C25 55 40 70 40 70Z" fill="currentColor" />
            <path d="M10 40C10 40 25 55 40 40C25 25 10 40 10 40Z" fill="currentColor" />
          </svg>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center z-10 px-10 w-full"
      >
        <TopLabel design={design} />

        {/* 대표사진 — 미니멀·클래식·로맨틱만 아치형, 모던은 직사각형 */}
        {heroPhoto && (
          <div className="flex justify-center mb-10">
            <div
              className="overflow-hidden w-44 h-56"
              style={{ borderRadius: design === 'modern' ? '8px' : '78px 78px 8px 8px' }}
            >
              <img src={heroPhoto} alt="대표사진" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* 이름 */}
        <div className={`space-y-1 mb-10 ${design === 'modern' ? 'space-y-0' : ''}`}>
          <h1 className="text-[2.6rem] leading-tight" style={nameStyle(design)}>
            {data.groom.name || '신랑'}
          </h1>
          <NameSeparator design={design} />
          <h1 className="text-[2.6rem] leading-tight" style={nameStyle(design)}>
            {data.bride.name || '신부'}
          </h1>
        </div>

        {/* 구분선 */}
        {design !== 'modern' && (
          <div className="w-14 h-px mx-auto mb-8" style={{ background: 'var(--color-wedding-accent)', opacity: 0.35 }} />
        )}
        {design === 'modern' && (
          <div className="flex flex-col items-center gap-1 mb-8">
            <div className="w-20 h-px" style={{ background: 'var(--color-wedding-accent)' }} />
            <div className="w-10 h-px" style={{ background: 'var(--color-wedding-accent)', opacity: 0.4 }} />
          </div>
        )}

        {/* 날짜 및 장소 */}
        <div className="space-y-1.5 mb-10">
          <p
            className="text-base tracking-[0.2em]"
            style={{
              fontFamily: design === 'modern' ? 'Pretendard Variable, Pretendard, sans-serif' : 'Cormorant Garamond, serif',
              fontWeight: design === 'modern' ? 500 : 400,
              color: 'var(--color-wedding-secondary, #9A8F80)',
            }}
          >
            {dateDisplay}
          </p>
          {weekdayDisplay && (
            <p className="text-[13px] tracking-wider" style={{ fontFamily: 'Gowun Batang, serif', color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.8 }}>
              {weekdayDisplay}
            </p>
          )}
          {data.location.name && (
            <p className="text-xs tracking-[0.25em] uppercase mt-1" style={{ color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.7 }}>
              {data.location.name}
            </p>
          )}
        </div>

        {/* D-Day 카운트다운 */}
        {data.weddingDate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
            {isPast ? (
              <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.6 }}>
                결혼식이 거행되었습니다
              </p>
            ) : (
              <div className="inline-flex items-end gap-4 justify-center border px-8 py-5" style={{ borderColor: 'var(--color-wedding-accent)' }}>
                {[
                  { value: countdown.days, label: 'DAYS' },
                  { value: countdown.hours, label: 'HRS' },
                  { value: countdown.minutes, label: 'MIN' },
                  { value: countdown.seconds, label: 'SEC' },
                ].map(({ value, label }, i) => (
                  <React.Fragment key={label}>
                    {i > 0 && <span className="text-sm pb-5" style={{ color: 'var(--color-wedding-accent)', opacity: 0.3 }}>·</span>}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-light tabular-nums w-10 text-center leading-none" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-primary, #4A423A)' }}>
                        {String(value).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] tracking-[0.2em]" style={{ color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.55 }}>
                        {label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* 배경 앰비언트 글로우 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-25%] left-[-25%] w-[65%] h-[65%] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, var(--color-wedding-accent) 0%, transparent 70%)', filter: 'blur(90px)' }} />
        <div className="absolute bottom-[-25%] right-[-25%] w-[65%] h-[65%] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, var(--color-wedding-accent) 0%, transparent 70%)', filter: 'blur(90px)' }} />
      </div>
    </section>
  );
};

export default MainVisual;
