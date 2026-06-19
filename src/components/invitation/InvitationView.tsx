import React, { useEffect } from 'react';
import type { WeddingData } from '../../types/wedding';
import { getTemplate } from '../../utils/templates';
import MainVisual from './MainVisual';
import GreetingSection from './GreetingSection';
import WeddingInfo from './WeddingInfo';
import MapSection from './MapSection';
import Gallery from './Gallery';
import AccountInfo from './AccountInfo';
import ShareSection from './ShareSection';

interface Props {
  data: WeddingData;
}

const InvitationView: React.FC<Props> = ({ data }) => {
  const tpl = getTemplate(data.template);

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
      <GreetingSection
        greeting={data.greeting}
        groom={data.groom}
        bride={data.bride}
        groomParents={data.groomParents}
        brideParents={data.brideParents}
      />
      <WeddingInfo date={data.weddingDate} time={data.weddingTime} location={data.location} />
      <MapSection location={data.location} />
      <Gallery images={data.galleryImages} />
      <AccountInfo groom={data.groom} bride={data.bride} />
      <ShareSection data={data} />
    </div>
  );
};

export default InvitationView;
