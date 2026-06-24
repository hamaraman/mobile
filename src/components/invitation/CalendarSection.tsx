import React from 'react';
import Reveal from './Reveal';
import OrnamentDivider from './OrnamentDivider';

interface Props {
  date: string;
  groomName: string;
  brideName: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const MONTH_EN = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

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

  // D-Day 뱃지 텍스트
  let dDayTop: string;
  let dDayBottom: string;
  if (dDay > 0) {
    dDayTop = `D - ${dDay}`;
    dDayBottom = `${dDay}일 남았어요`;
  } else if (dDay === 0) {
    dDayTop = 'D - DAY';
    dDayBottom = '오늘이에요';
  } else {
    dDayTop = `D + ${Math.abs(dDay)}`;
    dDayBottom = `함께한 날`;
  }

  return (
    <section className="py-24 px-8" style={{ background: 'var(--t-page-bg, #FBF8F2)' }}>
      <Reveal>
        <div className="text-center mb-10">
          <p
            className="text-[10px] tracking-[0.45em] uppercase mb-1"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)', fontStyle: 'italic' }}
          >
            Save the Date
          </p>
          <p
            className="text-lg tracking-widest"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-secondary, #9A8F80)' }}
          >
            {MONTH_EN[month]} {year}
          </p>
        </div>

        <div className="max-w-[280px] mx-auto">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-y-2 text-center mb-1">
            {WEEKDAYS.map((w, i) => (
              <span
                key={w}
                className="text-[10px] tracking-wider pb-2"
                style={{ color: i === 0 ? '#C98A7A' : 'var(--color-wedding-secondary, #9A8F80)', opacity: 0.7 }}
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
                      className={isWedding
                        ? 'relative flex items-center justify-center w-9 h-9 text-[15px] font-serif text-white'
                        : 'text-[15px]'}
                      style={!isWedding ? { color: isSunday ? '#C98A7A' : 'var(--color-wedding-primary, #4A423A)', opacity: 0.75 } : undefined}
                    >
                      {isWedding && (
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{ background: 'var(--color-wedding-accent)' }}
                        />
                      )}
                      <span className="relative" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{day}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <OrnamentDivider className="mt-10 mb-8" />

          {/* D-Day 뱃지 */}
          <div className="text-center">
            <div
              className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-full"
              style={{ background: 'color-mix(in srgb, var(--color-wedding-accent, #C9A36B) 12%, transparent)' }}
            >
              <p
                className="text-2xl font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)' }}
              >
                {dDayTop}
              </p>
              <p className="text-[11px] tracking-wider" style={{ color: 'var(--color-wedding-secondary, #9A8F80)' }}>
                {dDayBottom}
              </p>
            </div>

            <p
              className="mt-4 text-sm tracking-wider"
              style={{ fontFamily: 'Gowun Batang, serif', color: 'var(--color-wedding-secondary, #9A8F80)' }}
            >
              {groomName || '신랑'}
              <span className="mx-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-wedding-accent)', fontStyle: 'italic' }}>&</span>
              {brideName || '신부'}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CalendarSection;
