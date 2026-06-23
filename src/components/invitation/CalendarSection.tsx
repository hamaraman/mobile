import React from 'react';
import Reveal from './Reveal';
import OrnamentDivider from './OrnamentDivider';

interface Props {
  date: string;
  groomName: string;
  brideName: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarSection: React.FC<Props> = ({ date, groomName, brideName }) => {
  const d = date ? new Date(date) : null;
  if (!d || isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = d.getMonth();
  const weddingDay = d.getDate();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weddingMidnight = new Date(year, month, weddingDay);
  const dDay = Math.round((weddingMidnight.getTime() - startOfToday.getTime()) / 86400000);

  const dDayText =
    dDay > 0 ? `D - ${dDay}`
    : dDay === 0 ? 'D - Day'
    : `D + ${Math.abs(dDay)}`;

  const dDayDesc =
    dDay > 0 ? '결혼식이 다가오고 있습니다'
    : dDay === 0 ? '오늘은 저희의 결혼식입니다'
    : '결혼식이 거행되었습니다';

  return (
    <section className="py-24 px-8" style={{ background: 'var(--t-page-bg, #FFFFFF)' }}>
      <Reveal>
        <div className="text-center mb-12">
          <p className="text-[9px] tracking-[0.45em] text-wedding-accent uppercase">Calendar</p>
          <p className="font-serif text-sm text-wedding-secondary/65 mt-2 tracking-widest">
            {year}년 {month + 1}월
          </p>
        </div>

        <div className="max-w-[280px] mx-auto">
          <div className="grid grid-cols-7 gap-y-2 text-center mb-1">
            {WEEKDAYS.map((w, i) => (
              <span
                key={w}
                className={`text-[10px] tracking-wider pb-2 ${i === 0 ? 'text-rose-400/75' : 'text-wedding-secondary/55'}`}
              >
                {w}
              </span>
            ))}

            {cells.map((day, idx) => {
              const isWedding = day === weddingDay;
              const isSunday = idx % 7 === 0;
              return (
                <div key={idx} className="flex items-center justify-center h-9">
                  {day && (
                    <span
                      className={
                        isWedding
                          ? 'relative flex items-center justify-center w-9 h-9 text-[13px] font-serif text-white'
                          : `text-[13px] ${isSunday ? 'text-rose-400/65' : 'text-wedding-primary/70'}`
                      }
                    >
                      {isWedding && (
                        <span className="absolute inset-0 rounded-full bg-wedding-accent" />
                      )}
                      <span className="relative">{day}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <OrnamentDivider className="mt-10 mb-8" />

          <div className="text-center space-y-2">
            <p className="font-serif text-2xl font-light tracking-[0.08em] text-wedding-accent">{dDayText}</p>
            <p className="font-serif text-sm text-wedding-secondary tracking-wider mt-1">
              {groomName}
              <svg width="10" height="10" viewBox="0 0 10 10" className="inline text-wedding-accent/50 mx-2 mb-0.5" fill="currentColor">
                <path d="M5 0L5.8 3.6L10 5L5.8 6.4L5 10L4.2 6.4L0 5L4.2 3.6L5 0Z" />
              </svg>
              {brideName}
            </p>
            <p className="text-[10px] tracking-[0.25em] text-wedding-secondary/55">{dDayDesc}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CalendarSection;
