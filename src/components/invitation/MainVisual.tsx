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
    <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--t-main-bg, #FDFBF7)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center z-10 space-y-4"
      >
        <p className="tracking-[0.3em] text-sm text-wedding-secondary mb-2">WEDDING DAY</p>
        <h1 className="text-4xl md:text-5xl font-serif text-wedding-primary">
          {data.groom.name} <span className="text-2xl align-middle mx-1">&</span> {data.bride.name}
        </h1>
        <div className="w-px h-12 bg-wedding-accent mx-auto my-6"></div>
        <p className="serif text-lg text-wedding-secondary">{formattedDate}</p>
        <p className="serif text-lg text-wedding-secondary">{data.location.name}</p>

        {data.weddingDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8"
          >
            {isPast ? (
              <p className="text-sm text-wedding-secondary tracking-widest serif">결혼식이 거행되었습니다</p>
            ) : (
              <div className="flex items-end gap-5 justify-center">
                {[
                  { value: countdown.days, label: '일' },
                  { value: countdown.hours, label: '시간' },
                  { value: countdown.minutes, label: '분' },
                  { value: countdown.seconds, label: '초' },
                ].map(({ value, label }, i) => (
                  <React.Fragment key={label}>
                    {i > 0 && <span className="text-wedding-accent/40 text-lg pb-5">:</span>}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-serif font-light text-wedding-primary tabular-nums w-10 text-center">
                        {String(value).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] tracking-widest text-wedding-secondary mt-1">{label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-wedding-accent/5 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-wedding-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Slowly drifting petals */}
        {[
          { left: '12%', size: 6, dur: 11, delay: 0 },
          { left: '32%', size: 4, dur: 14, delay: 2.5 },
          { left: '58%', size: 5, dur: 12, delay: 1.2 },
          { left: '78%', size: 4, dur: 16, delay: 3.4 },
          { left: '88%', size: 6, dur: 13, delay: 0.8 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute top-[-8%] rounded-full bg-wedding-accent/30"
            style={{ left: p.left, width: p.size, height: p.size }}
            animate={{ y: ['0vh', '90vh'], x: [0, 14, -8, 0], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'linear', delay: p.delay }}
          />
        ))}
      </div>
    </section>
  );
};

export default MainVisual;
