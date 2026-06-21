import React, { useEffect } from 'react';
import type { WeddingData } from '../../types/wedding';
import { getTemplate } from '../../utils/templates';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import MainVisual from './MainVisual';
import GreetingSection from './GreetingSection';
import WeddingInfo from './WeddingInfo';
import CalendarSection from './CalendarSection';
import MapSection from './MapSection';
import Gallery from './Gallery';
import AccountInfo from './AccountInfo';
import ShareSection from './ShareSection';
import Reveal from './Reveal';

interface Props {
  data: WeddingData;
}

const InvitationView: React.FC<Props> = ({ data }) => {
  const tpl = getTemplate(data.template);

  const names = data.groom.name && data.bride.name
    ? `${data.groom.name} ♥ ${data.bride.name}`
    : '모바일 청첩장';
  useDocumentMeta({
    title: `${names} 결혼합니다`,
    description: `${data.location.name || '예식장'}에서 열리는 ${data.groom.name || '신랑'} · ${data.bride.name || '신부'}의 결혼식에 초대합니다.`,
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-wedding-accent', tpl.accent);
    root.style.setProperty('--color-wedding-primary', tpl.primary);
    root.style.setProperty('--color-wedding-secondary', tpl.secondary);
    root.style.setProperty('--t-main-bg', tpl.mainBg);
    root.style.setProperty('--t-section-bg', tpl.sectionBg);
    root.style.setProperty('--t-page-bg', tpl.pageBg);
    root.style.setProperty('--t-card-bg', tpl.cardBg);
    return () => {
      ['--color-wedding-accent','--color-wedding-primary','--color-wedding-secondary',
       '--t-main-bg','--t-section-bg','--t-page-bg','--t-card-bg'].forEach(v =>
        root.style.removeProperty(v)
      );
    };
  }, [tpl]);

  return (
    <div
      className="max-w-screen-sm mx-auto shadow-xl min-h-screen pb-20 overflow-x-hidden"
      style={{ background: tpl.pageBg }}
    >
      <MainVisual data={data} />
      <Reveal>
        <GreetingSection
          greeting={data.greeting}
          groom={data.groom}
          bride={data.bride}
          groomParents={data.groomParents}
          brideParents={data.brideParents}
        />
      </Reveal>
      <Reveal>
        <WeddingInfo date={data.weddingDate} time={data.weddingTime} location={data.location} />
      </Reveal>
      <CalendarSection date={data.weddingDate} groomName={data.groom.name} brideName={data.bride.name} />
      <Reveal>
        <MapSection location={data.location} />
      </Reveal>
      <Reveal>
        <Gallery images={data.galleryImages} />
      </Reveal>
      <Reveal>
        <AccountInfo groom={data.groom} bride={data.bride} />
      </Reveal>
      <Reveal>
        <ShareSection data={data} />
      </Reveal>
    </div>
  );
};

export default InvitationView;
