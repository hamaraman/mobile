import React from 'react';
import Reveal from './Reveal';

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
  const month = d.getMonth(); // 0-based
  const weddingDay = d.getDate();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a flat list of cells: leading blanks + each day of the month.
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // D-Day calculated from the start of today vs. the wedding day.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weddingMidnight = new Date(year, month, weddingDay);
  const dDay = Math.round((weddingMidnight.getTime() - startOfToday.getTime()) / 86400000);

  const dDayText =
    dDay > 0 ? `결혼식이 ${dDay}일 남았습니다`
    : dDay === 0 ? '오늘은 저희의 결혼식입니다'
    : '결혼식이 거행되었습니다';

  return (
    <section className="py-20 px-8" style={{ background: 'var(--t-section-bg, #FAF9F7)' }}>
      <Reveal>
        <h2 className="text-xl tracking-[0.2em] text-wedding-accent text-center mb-3">CALENDAR</h2>
        <p className="serif text-center text-wedding-secondary mb-10">
          {year}년 {month + 1}월
        </p>

        <div className="max-w-xs mx-auto">
          <div className="grid grid-cols-7 gap-y-3 text-center">
            {WEEKDAYS.map((w, i) => (
              <span
                key={w}
                className={`text-xs tracking-wider ${i === 0 ? 'text-rose-400' : 'text-wedding-secondary'}`}
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
                          ? 'flex items-center justify-center w-9 h-9 rounded-full bg-wedding-accent text-white text-sm font-medium shadow-sm'
                          : `text-sm ${isSunday ? 'text-rose-400/80' : 'text-wedding-primary/80'}`
                      }
                    >
                      {day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-wedding-accent/20 text-center space-y-1">
            <p className="serif text-wedding-primary">
              {groomName} <span className="text-wedding-accent mx-1">♥</span> {brideName}
            </p>
            <p className="text-sm text-wedding-secondary tracking-wide">{dDayText}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CalendarSection;
