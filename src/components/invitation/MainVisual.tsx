import React, { useState, useEffect } from 'react';
import type { WeddingData } from '../../types/wedding';
import { motion } from 'framer-motion';

interface Props {
  data: WeddingData;
}

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

const MainVisual: React.FC<Props> = ({ data }) => {
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  const date = data.weddingDate ? new Date(data.weddingDate) : null;
  const isValidDate = date && !isNaN(date.getTime());

  // YYYY . MM . DD 형식
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

  // 첫 번째 갤러리 이미지를 대표사진으로 사용
  const heroPhoto = data.galleryImages[0];

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--t-main-bg, #FBF8F2)', minHeight: '100svh' }}
    >
      {/* 코너 브래킷 장식 */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t border-l pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent, #C9A36B)', opacity: 0.4 }} />
      <div className="absolute top-8 right-8 w-10 h-10 border-t border-r pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent, #C9A36B)', opacity: 0.4 }} />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent, #C9A36B)', opacity: 0.4 }} />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r pointer-events-none" style={{ borderColor: 'var(--color-wedding-accent, #C9A36B)', opacity: 0.4 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center z-10 px-10 w-full"
      >
        {/* WEDDING DAY 레이블 */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-px" style={{ background: 'var(--color-wedding-accent)', opacity: 0.35 }} />
          <span
            className="text-[9px] tracking-[0.45em] font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)', fontStyle: 'italic' }}
          >
            the wedding of
          </span>
          <div className="w-10 h-px" style={{ background: 'var(--color-wedding-accent)', opacity: 0.35 }} />
        </div>

        {/* 대표사진 (아치형) */}
        {heroPhoto && (
          <div className="flex justify-center mb-10">
            <div
              className="overflow-hidden w-44 h-56"
              style={{ borderRadius: '78px 78px 8px 8px' }}
            >
              <img src={heroPhoto} alt="대표사진" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* 이름 */}
        <div className="space-y-2 mb-10">
          <h1
            className="text-[2.6rem] font-normal tracking-[0.15em] leading-tight"
            style={{ fontFamily: 'Gowun Batang, serif', color: 'var(--color-wedding-primary, #4A423A)' }}
          >
            {data.groom.name || '신랑'}
          </h1>
          <div className="flex items-center justify-center py-1">
            <span
              className="text-3xl"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)', fontStyle: 'italic' }}
            >
              &
            </span>
          </div>
          <h1
            className="text-[2.6rem] font-normal tracking-[0.15em] leading-tight"
            style={{ fontFamily: 'Gowun Batang, serif', color: 'var(--color-wedding-primary, #4A423A)' }}
          >
            {data.bride.name || '신부'}
          </h1>
        </div>

        {/* 구분선 */}
        <div className="w-14 h-px mx-auto mb-8" style={{ background: 'var(--color-wedding-accent)', opacity: 0.35 }} />

        {/* 날짜 및 장소 */}
        <div className="space-y-1.5 mb-10">
          <p
            className="text-base tracking-[0.2em]"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-secondary, #9A8F80)' }}
          >
            {dateDisplay}
          </p>
          {weekdayDisplay && (
            <p
              className="text-[13px] tracking-wider"
              style={{ fontFamily: 'Gowun Batang, serif', color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.8 }}
            >
              {weekdayDisplay}
            </p>
          )}
          {data.location.name && (
            <p
              className="text-xs tracking-[0.25em] uppercase mt-1"
              style={{ color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.7 }}
            >
              {data.location.name}
            </p>
          )}
        </div>

        {/* D-Day 카운트다운 */}
        {data.weddingDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {isPast ? (
              <p
                className="text-[10px] tracking-[0.35em] uppercase"
                style={{ color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.6 }}
              >
                결혼식이 거행되었습니다
              </p>
            ) : (
              <div
                className="inline-flex items-end gap-4 justify-center border px-8 py-5"
                style={{ borderColor: 'var(--color-wedding-accent)' }}
              >
                {[
                  { value: countdown.days, label: 'DAYS' },
                  { value: countdown.hours, label: 'HRS' },
                  { value: countdown.minutes, label: 'MIN' },
                  { value: countdown.seconds, label: 'SEC' },
                ].map(({ value, label }, i) => (
                  <React.Fragment key={label}>
                    {i > 0 && (
                      <span className="text-sm pb-5" style={{ color: 'var(--color-wedding-accent)', opacity: 0.3 }}>·</span>
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className="text-2xl font-light tabular-nums w-10 text-center leading-none"
                        style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-primary, #4A423A)' }}
                      >
                        {String(value).padStart(2, '0')}
                      </span>
                      <span
                        className="text-[8px] tracking-[0.2em]"
                        style={{ color: 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.55 }}
                      >
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
        <div
          className="absolute top-[-25%] left-[-25%] w-[65%] h-[65%] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, var(--color-wedding-accent) 0%, transparent 70%)', filter: 'blur(90px)' }}
        />
        <div
          className="absolute bottom-[-25%] right-[-25%] w-[65%] h-[65%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-wedding-accent) 0%, transparent 70%)', filter: 'blur(90px)' }}
        />
      </div>
    </section>
  );
};

export default MainVisual;
