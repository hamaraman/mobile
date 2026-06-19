import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  location: { name: string; address: string; lat?: number; lng?: number };
  naverClientId?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

type Status = 'idle' | 'loading' | 'ok' | 'approximate' | 'error';

/* ─── Korean coordinate fallback ─── */
const KR_COORDS: [string, number, number][] = [
  ['강남구', 37.5172, 127.0473], ['서초구', 37.4837, 127.0324],
  ['송파구', 37.5145, 127.1059], ['강동구', 37.5301, 127.1238],
  ['마포구', 37.5663, 126.9014], ['용산구', 37.5311, 126.9810],
  ['종로구', 37.5735, 126.9790], ['중구',   37.5640, 126.9975],
  ['영등포구', 37.5264, 126.8963], ['성동구', 37.5634, 127.0369],
  ['광진구', 37.5384, 127.0823], ['노원구', 37.6543, 127.0568],
  ['서대문구', 37.5791, 126.9368], ['동대문구', 37.5744, 127.0396],
  ['은평구', 37.6176, 126.9227], ['성북구', 37.5894, 127.0167],
  ['서울', 37.5665, 126.9780], ['부산', 35.1796, 129.0756],
  ['인천', 37.4563, 126.7052], ['대구', 35.8714, 128.6014],
  ['대전', 36.3504, 127.3845], ['광주', 35.1595, 126.8526],
  ['울산', 35.5384, 129.3114], ['수원', 37.2636, 127.0286],
  ['성남', 37.4449, 127.1389], ['고양', 37.6584, 126.8320],
  ['용인', 37.2411, 127.1776], ['창원', 35.2280, 128.6811],
];

function krFallback(text: string) {
  for (const [n, lat, lng] of KR_COORDS) {
    if (text.includes(n)) return { lat, lng };
  }
  return null;
}

/* ─── Naver Map ─── */
const NaverMap: React.FC<{ location: Props['location']; clientId: string; onAuthFail: () => void }> = ({ location, clientId, onAuthFail }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    const initMap = (lat: number, lng: number) => {
      if (cancelled || !containerRef.current || !window.naver) return;

      const center = new window.naver.maps.LatLng(lat, lng);
      const map = new window.naver.maps.Map(containerRef.current, {
        center,
        zoom: 16,
        mapTypeControl: false,
        scaleControl: false,
        logoControlOptions: { position: window.naver.maps.Position.BOTTOM_LEFT },
      });

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-wedding-accent').trim() || '#B08E8E';

      const markerHtml = `
        <div style="
          width:22px;height:22px;
          background:${accent};
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
        "></div>`;

      const marker = new window.naver.maps.Marker({
        position: center,
        map,
        icon: { content: markerHtml, anchor: new window.naver.maps.Point(11, 22) },
      });

      if (location.name) {
        const infoEl = `<div style="padding:6px 10px;font-size:12px;font-family:'Noto Serif KR',serif;color:#333;white-space:nowrap;background:white;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.15)">${location.name}</div>`;
        const infoWindow = new window.naver.maps.InfoWindow({ content: infoEl, borderWidth: 0, backgroundColor: 'transparent', disableAnchor: true });
        infoWindow.open(map, marker);
      }

      if (!cancelled) {
        setStatus('ok');
        setTimeout(() => {
          if (!cancelled && containerRef.current?.textContent?.includes('인증이 실패')) {
            onAuthFail();
          }
        }, 1500);
      }
    };

    const geocodeAndInit = () => {
      if (!window.naver?.maps) { if (!cancelled) onAuthFail(); return; }

      if (location.lat && location.lng) {
        initMap(location.lat, location.lng);
        return;
      }

      if (!window.naver.maps.Service) { if (!cancelled) onAuthFail(); return; }

      window.naver.maps.Service.geocode(
        { query: location.address },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (status: string, response: any) => {
          if (cancelled) return;
          if (status === window.naver.maps.Service.Status.OK && response.v2.meta.totalCount > 0) {
            const { x, y } = response.v2.addresses[0];
            initMap(parseFloat(y), parseFloat(x));
          } else {
            const fallback = krFallback(location.address + ' ' + location.name);
            if (fallback) {
              initMap(fallback.lat, fallback.lng);
              if (!cancelled) setStatus('approximate');
            } else {
              if (!cancelled) onAuthFail();
            }
          }
        }
      );
    };

    const scriptId = 'naver-maps-sdk';
    if (window.naver?.maps) {
      geocodeAndInit();
    } else {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
      script.onload = () => { if (!cancelled) geocodeAndInit(); };
      script.onerror = () => { if (!cancelled) onAuthFail(); };
      document.head.appendChild(script);
    }

    return () => { cancelled = true; };
  }, [location.address, location.lat, location.lng, location.name, clientId, onAuthFail]);

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center gap-1.5">
          {[0, 150, 300].map(d => (
            <div key={d} className="w-1.5 h-1.5 bg-wedding-accent rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      )}
    </>
  );
};

/* ─── OSM Map ─── */
const OsmMap: React.FC<{ location: Props['location'] }> = ({ location }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) { setStatus('error'); return; }
    if (!location.address && !location.lat) { setStatus('idle'); return; }

    let cancelled = false;

    const initWithCoords = (lat: number, lng: number, approximate = false) => {
      if (cancelled) return;
      try {
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (container as any)._leaflet_id = undefined;

        const map = L.map(container, {
          center: [lat, lng],
          zoom: approximate ? 13 : 16,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        if (!approximate) {
          const accent = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-wedding-accent').trim() || '#B08E8E';
          const icon = L.divIcon({
            html: `<div style="width:20px;height:20px;background:${accent};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -24],
          });
          const marker = L.marker([lat, lng], { icon }).addTo(map);
          if (location.name) {
            marker.bindPopup(
              `<span style="font-size:12px;font-family:'Noto Serif KR',serif">${location.name}</span>`,
              { closeButton: false }
            ).openPopup();
          }
        }

        mapRef.current = map;
        if (!cancelled) setStatus(approximate ? 'approximate' : 'ok');
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    if (location.lat && location.lng) {
      initWithCoords(location.lat, location.lng);
      return () => {
        cancelled = true;
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      };
    }

    const queries = [
      location.name ? `${location.name} ${location.address?.split(' ').slice(0, 2).join(' ')}` : null,
      location.address,
      location.address?.split(' ').slice(0, 3).join(' '),
    ].filter(Boolean) as string[];

    (async () => {
      for (const q of queries) {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=kr`);
          const d = await r.json() as { lat: string; lon: string }[];
          if (d.length > 0 && !cancelled) {
            initWithCoords(parseFloat(d[0].lat), parseFloat(d[0].lon), q !== location.address);
            return;
          }
        } catch { /* continue */ }
      }
      const fb = krFallback((location.address ?? '') + ' ' + (location.name ?? ''));
      if (fb && !cancelled) initWithCoords(fb.lat, fb.lng, true);
      else if (!cancelled) setStatus('error');
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [location.address, location.lat, location.lng, location.name]);

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center gap-1.5">
          {[0, 150, 300].map(d => (
            <div key={d} className="w-1.5 h-1.5 bg-wedding-accent rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2">
          <p className="serif text-wedding-secondary text-sm">지도를 불러오지 못했습니다.</p>
          <p className="text-[11px] text-gray-400 px-4 text-center">{location.address}</p>
        </div>
      )}
      {status === 'approximate' && (
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
          <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">대략적인 위치입니다</span>
        </div>
      )}
    </>
  );
};

/* ─── Main MapSection ─── */
const MapSection: React.FC<Props> = ({ location, naverClientId }) => {
  const [useNaver, setUseNaver] = useState(!!naverClientId);

  const openKakao = () =>
    window.open(`https://map.kakao.com/link/search/${encodeURIComponent(location.name || location.address)}`, '_blank');
  const openNaver = () =>
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(location.name || location.address)}`, '_blank');

  return (
    <section className="py-12 px-6 space-y-4">
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        {useNaver && naverClientId
          ? <NaverMap location={location} clientId={naverClientId} onAuthFail={() => setUseNaver(false)} />
          : <OsmMap location={location} />
        }
      </div>

      <div className="flex gap-2">
        <button onClick={openKakao} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors text-wedding-primary">
          카카오맵
        </button>
        <button onClick={openNaver} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors text-wedding-primary">
          네이버 지도
        </button>
      </div>
    </section>
  );
};

export default MapSection;
