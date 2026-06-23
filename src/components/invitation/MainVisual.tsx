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
  const formattedDate = date && !isNaN(date.getTime())
    ? date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })
    : '2026년 10월 24일 토요일';

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

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--t-main-bg, #FDFBF7)', minHeight: '100svh' }}
    >
      {/* 코너 브래킷 장식 */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-wedding-accent/40 pointer-events-none" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-wedding-accent/40 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-wedding-accent/40 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-wedding-accent/40 pointer-events-none" />

      {/* 메인 콘텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center z-10 px-12"
      >
        {/* WEDDING DAY 레이블 */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <div className="w-10 h-px bg-wedding-accent/35" />
          <span className="text-[9px] tracking-[0.45em] text-wedding-accent font-light">WEDDING DAY</span>
          <div className="w-10 h-px bg-wedding-accent/35" />
        </div>

        {/* 이름 */}
        <div className="space-y-3 mb-14">
          <h1 className="font-serif text-[2.2rem] font-light tracking-[0.18em] text-wedding-primary leading-tight">
            {data.groom.name || '신랑'}
          </h1>
          <div className="flex items-center justify-center py-1">
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-wedding-accent/55" fill="currentColor">
              <path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" />
            </svg>
          </div>
          <h1 className="font-serif text-[2.2rem] font-light tracking-[0.18em] text-wedding-primary leading-tight">
            {data.bride.name || '신부'}
          </h1>
        </div>

        {/* 얇은 구분선 */}
        <div className="w-14 h-px bg-wedding-accent/35 mx-auto mb-10" />

        {/* 날짜 및 장소 */}
        <div className="space-y-2 mb-12">
          <p className="font-serif text-sm tracking-[0.15em] text-wedding-secondary font-light">{formattedDate}</p>
          {data.location.name && (
            <p className="text-[10px] tracking-[0.25em] text-wedding-secondary/70 uppercase mt-1">
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
              <p className="text-[10px] tracking-[0.35em] text-wedding-secondary/60 uppercase">결혼식이 거행되었습니다</p>
            ) : (
              <div className="inline-flex items-end gap-4 justify-center border border-wedding-accent/25 px-8 py-5">
                {[
                  { value: countdown.days, label: 'DAYS' },
                  { value: countdown.hours, label: 'HRS' },
                  { value: countdown.minutes, label: 'MIN' },
                  { value: countdown.seconds, label: 'SEC' },
                ].map(({ value, label }, i) => (
                  <React.Fragment key={label}>
                    {i > 0 && <span className="text-wedding-accent/30 text-sm pb-5">·</span>}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-serif font-light text-wedding-primary tabular-nums w-10 text-center leading-none">
                        {String(value).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] text-wedding-secondary/55">{label}</span>
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
          className="absolute top-[-25%] left-[-25%] w-[65%] h-[65%] rounded-full opacity-35"
          style={{ background: 'radial-gradient(circle, var(--color-wedding-accent) 0%, transparent 70%)', filter: 'blur(90px)' }}
        />
        <div
          className="absolute bottom-[-25%] right-[-25%] w-[65%] h-[65%] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, var(--color-wedding-accent) 0%, transparent 70%)', filter: 'blur(90px)' }}
        />
      </div>
    </section>
  );
};

export default MainVisual;
