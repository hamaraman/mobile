import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface Props {
  location: { name: string; address: string; lat?: number; lng?: number };
}

type GeoStatus = 'idle' | 'loading' | 'ok' | 'approximate' | 'error';

/* ─── Korean administrative coordinates fallback ─── */
const KR_COORDS: [string, number, number][] = [
  // Seoul districts (most wedding venues)
  ['강남구', 37.5172, 127.0473], ['서초구', 37.4837, 127.0324],
  ['송파구', 37.5145, 127.1059], ['강동구', 37.5301, 127.1238],
  ['마포구', 37.5663, 126.9014], ['용산구', 37.5311, 126.9810],
  ['종로구', 37.5735, 126.9790], ['중구',   37.5640, 126.9975],
  ['영등포구', 37.5264, 126.8963], ['광진구', 37.5384, 127.0823],
  ['성동구', 37.5634, 127.0369], ['노원구', 37.6543, 127.0568],
  ['은평구', 37.6176, 126.9227], ['서대문구', 37.5791, 126.9368],
  ['동대문구', 37.5744, 127.0396], ['성북구', 37.5894, 127.0167],
  // Major cities
  ['서울', 37.5665, 126.9780], ['부산', 35.1796, 129.0756],
  ['인천', 37.4563, 126.7052], ['대구', 35.8714, 128.6014],
  ['대전', 36.3504, 127.3845], ['광주', 35.1595, 126.8526],
  ['울산', 35.5384, 129.3114], ['수원', 37.2636, 127.0286],
  ['성남', 37.4449, 127.1389], ['고양', 37.6584, 126.8320],
  ['용인', 37.2411, 127.1776], ['창원', 35.2280, 128.6811],
  ['청주', 36.6424, 127.4890], ['전주', 35.8242, 127.1480],
];

function getKrFallback(text: string): { lat: number; lng: number } | null {
  for (const [name, lat, lng] of KR_COORDS) {
    if (text.includes(name)) return { lat, lng };
  }
  return null;
}

async function geocode(name: string, address: string): Promise<{ lat: number; lng: number; approximate: boolean } | null> {
  // Build a prioritized list of queries to try
  const queries = [
    // 1. Venue name + city (best for well-known POIs)
    name && address ? `${name} ${address.split(' ').slice(0, 2).join(' ')}` : null,
    name || null,
    // 2. Full address
    address || null,
    // 3. District level (drop last token progressively)
    address ? address.split(' ').slice(0, 3).join(' ') : null,
    address ? address.split(' ').slice(0, 2).join(' ') : null,
  ].filter(Boolean) as string[];

  for (const q of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=kr&accept-language=ko`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json() as { lat: string; lon: string }[];
      if (data.length > 0) {
        const isApproximate = q !== name && q !== address;
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), approximate: isApproximate };
      }
    } catch { /* try next query */ }
  }

  // Korean coordinate fallback
  const kr = getKrFallback(address + ' ' + name);
  if (kr) return { ...kr, approximate: true };

  return null;
}

const MapSection: React.FC<Props> = ({ location }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');

  useEffect(() => {
    if (!location.address && !location.lat) { setStatus('idle'); return; }
    let cancelled = false;
    setStatus('loading');

    const render = async (lat: number, lng: number, approximate = false) => {
      if (cancelled || !containerRef.current) return;

      const L = await import('leaflet');
      if (cancelled) return;

      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

      const map = L.map(containerRef.current, {
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
          html: `<div style="
            width:20px;height:20px;
            background:${accent};
            border:3px solid white;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 20],
          popupAnchor: [0, -24],
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);

        if (location.name) {
          marker.bindPopup(
            `<span style="font-size:12px;font-family:'Noto Serif KR',serif;color:#333">${location.name}</span>`,
            { closeButton: false, offset: [0, -4] }
          ).openPopup();
        }
      }

      mapRef.current = map;
      setStatus(approximate ? 'approximate' : 'ok');
    };

    if (location.lat && location.lng) {
      render(location.lat, location.lng, false);
    } else {
      geocode(location.name, location.address).then(result => {
        if (cancelled) return;
        if (result) render(result.lat, result.lng, result.approximate);
        else setStatus('error');
      });
    }

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [location.address, location.lat, location.lng, location.name]);

  const openKakao = () =>
    window.open(`https://map.kakao.com/link/search/${encodeURIComponent(location.name || location.address)}`, '_blank');
  const openNaver = () =>
    window.open(`https://map.naver.com/v5/search/${encodeURIComponent(location.name || location.address)}`, '_blank');

  return (
    <section className="py-12 px-6 space-y-4">
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <div ref={containerRef} className="w-full h-full" />

        {status === 'idle' && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <p className="serif text-wedding-secondary text-sm italic">주소를 입력하면 지도가 표시됩니다.</p>
          </div>
        )}

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
            <p className="text-[11px] text-gray-400 text-center px-4">{location.address}</p>
          </div>
        )}

        {status === 'approximate' && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
            <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
              대략적인 위치입니다
            </span>
          </div>
        )}
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
