import React from 'react';
import type { Person, WeddingData } from '../../types/wedding';
import OrnamentDivider from './OrnamentDivider';

interface Props {
  greeting: { title: string; content: string };
  groom: Person;
  bride: Person;
  groomParents: WeddingData['groomParents'];
  brideParents: WeddingData['brideParents'];
}

const LeafOrnament = () => (
  <svg width="96" height="38" viewBox="0 0 96 38" fill="none" className="text-wedding-accent/40 mx-auto">
    <path d="M48 20 Q36 4 20 8 Q26 18 48 20Z" fill="currentColor" />
    <path d="M48 20 Q33 9 16 17 Q23 23 48 20Z" fill="currentColor" opacity="0.6" />
    <path d="M48 20 Q38 13 26 7 Q28 15 48 20Z" fill="currentColor" opacity="0.35" />
    <path d="M48 20 Q60 4 76 8 Q70 18 48 20Z" fill="currentColor" />
    <path d="M48 20 Q63 9 80 17 Q73 23 48 20Z" fill="currentColor" opacity="0.6" />
    <path d="M48 20 Q58 13 70 7 Q68 15 48 20Z" fill="currentColor" opacity="0.35" />
    <line x1="48" y1="20" x2="48" y2="34" stroke="currentColor" strokeWidth="0.75" />
    <circle cx="48" cy="20" r="2" fill="currentColor" opacity="0.75" />
  </svg>
);

const GreetingSection: React.FC<Props> = ({ greeting, groom, bride, groomParents, brideParents }) => {
  const hasParents =
    groomParents.father?.name || groomParents.mother?.name ||
    brideParents.father?.name || brideParents.mother?.name;

  return (
    <section className="py-24 px-8 text-center" style={{ background: 'var(--t-page-bg, #FFFFFF)' }}>
      <LeafOrnament />

      <div className="mt-10 space-y-8">
        <p className="text-[9px] tracking-[0.45em] text-wedding-accent uppercase">
          {greeting.title || '모시는 글'}
        </p>

        <div className="font-serif text-[1.05rem] leading-[2.4] text-wedding-primary/80 whitespace-pre-wrap max-w-[260px] mx-auto">
          {greeting.content || "서로가 마주보며 다진\n사랑을 이제 함께\n한 곳을 바라보며 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해주시면 감사하겠습니다."}
        </div>
      </div>

      <OrnamentDivider className="mt-14 mb-10" />

      <div>
        {hasParents ? (
          <div className="flex justify-between items-start gap-4 max-w-[260px] mx-auto">
            <div className="space-y-1 text-left flex-1">
              {groomParents.father?.name && (
                <p className="text-[10px] tracking-wide text-wedding-secondary/70">{groomParents.father.name}</p>
              )}
              {groomParents.mother?.name && (
                <p className="text-[10px] tracking-wide text-wedding-secondary/70">{groomParents.mother.name}</p>
              )}
              <p className="font-serif text-2xl font-light tracking-[0.1em] text-wedding-primary mt-3">{groom.name}</p>
            </div>
            <div className="text-wedding-secondary/25 text-xl mt-5 flex-shrink-0">·</div>
            <div className="space-y-1 text-right flex-1">
              {brideParents.father?.name && (
                <p className="text-[10px] tracking-wide text-wedding-secondary/70">{brideParents.father.name}</p>
              )}
              {brideParents.mother?.name && (
                <p className="text-[10px] tracking-wide text-wedding-secondary/70">{brideParents.mother.name}</p>
              )}
              <p className="font-serif text-2xl font-light tracking-[0.1em] text-wedding-primary mt-3">{bride.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-5">
            <span className="font-serif text-2xl font-light tracking-[0.12em] text-wedding-primary">{groom.name}</span>
            <span className="text-[11px] tracking-[0.3em] text-wedding-secondary/60">그리고</span>
            <span className="font-serif text-2xl font-light tracking-[0.12em] text-wedding-primary">{bride.name}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default GreetingSection;
