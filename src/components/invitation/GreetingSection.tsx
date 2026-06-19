import React from 'react';
import type { Person, WeddingData } from '../../types/wedding';

interface Props {
  greeting: { title: string; content: string };
  groom: Person;
  bride: Person;
  groomParents: WeddingData['groomParents'];
  brideParents: WeddingData['brideParents'];
}

const GreetingSection: React.FC<Props> = ({ greeting, groom, bride, groomParents, brideParents }) => {
  const hasParents =
    groomParents.father?.name || groomParents.mother?.name ||
    brideParents.father?.name || brideParents.mother?.name;

  return (
    <section className="py-24 px-8 text-center space-y-12">
      <div className="space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-wedding-accent">{greeting.title}</h2>
        <div className="serif text-wedding-primary leading-loose whitespace-pre-wrap">
          {greeting.content || "서로가 마주보며 다진\n사랑을 이제 함께\n한 곳을 바라보며 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해주시면 감사하겠습니다."}
        </div>
      </div>

      <div className="pt-8 border-t border-wedding-accent/20 max-w-xs mx-auto">
        {hasParents ? (
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 text-left flex-1">
              {groomParents.father?.name && (
                <p className="text-xs text-wedding-secondary">아버지 {groomParents.father.name}</p>
              )}
              {groomParents.mother?.name && (
                <p className="text-xs text-wedding-secondary">어머니 {groomParents.mother.name}</p>
              )}
              <p className="serif text-lg font-medium text-wedding-primary mt-2">{groom.name}</p>
            </div>
            <span className="text-wedding-secondary/30 text-2xl mt-3 flex-shrink-0">·</span>
            <div className="space-y-1 text-right flex-1">
              {brideParents.father?.name && (
                <p className="text-xs text-wedding-secondary">아버지 {brideParents.father.name}</p>
              )}
              {brideParents.mother?.name && (
                <p className="text-xs text-wedding-secondary">어머니 {brideParents.mother.name}</p>
              )}
              <p className="serif text-lg font-medium text-wedding-primary mt-2">{bride.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center serif text-lg">
            <span>{groom.name}</span>
            <span className="text-sm text-wedding-secondary mx-2">그리고</span>
            <span>{bride.name}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default GreetingSection;
