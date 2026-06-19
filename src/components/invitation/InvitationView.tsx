import React from 'react';
import type { WeddingData } from '../../types/wedding';
import { getThemeAccent } from '../../utils/themes';
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
  const accent = getThemeAccent(data.theme);

  return (
    <div
      className="max-w-screen-sm mx-auto bg-white shadow-xl min-h-screen pb-20 overflow-x-hidden"
      style={{ '--color-wedding-accent': accent } as React.CSSProperties}
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
