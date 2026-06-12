import React from 'react';
import type { Person } from '../../types/wedding';

interface Props {
  greeting: { title: string; content: string };
  groom: Person;
  bride: Person;
}

const GreetingSection: React.FC<Props> = ({ greeting, groom, bride }) => {
  return (
    <section className="py-24 px-8 text-center space-y-12">
      <div className="space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-wedding-accent">{greeting.title}</h2>
        <div className="serif text-wedding-primary leading-loose whitespace-pre-wrap">
          {greeting.content || "서로가 마주보며 다진\n사랑을 이제 함께\n한 곳을 바라보며 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해주시면 감사하겠습니다."}
        </div>
      </div>

      <div className="pt-8 border-t border-wedding-accent/20 max-w-[200px] mx-auto">
        <div className="flex justify-between items-center serif text-lg">
          <span>{groom.name}</span>
          <span className="text-sm text-wedding-secondary mx-2">그리고</span>
          <span>{bride.name}</span>
        </div>
      </div>
    </section>
  );
};

export default GreetingSection;
