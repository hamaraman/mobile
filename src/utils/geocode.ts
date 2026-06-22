// 주소 검색(다음 우편번호)과 주소 → 좌표 변환(지오코딩) 유틸.
// 한국 주소는 구글 무료 임베드가 제대로 못 잡으므로, 주소를 좌표로 바꿔 저장한 뒤
// 지도를 좌표 기준으로 띄운다. 좌표 변환은 카카오 지오코더를 먼저 쓰고,
// 실패하면 무료 Nominatim(OpenStreetMap)으로 폴백한다.

// 카카오 JavaScript 키 (ShareSection과 동일한 공개 키).
const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY || '35a6b3e9d3e47ea098f206c51459dbd9';

export type Coords = { lat: number; lng: number };
export type AddressResult = { address: string; zonecode: string };

/* eslint-disable @typescript-eslint/no-explicit-any */

// src별로 한 번만 로드하고, 같은 src 재요청 시 같은 Promise를 돌려준다.
const scriptCache = new Map<string, Promise<void>>();
function loadScript(src: string): Promise<void> {
  let p = scriptCache.get(src);
  if (!p) {
    p = new Promise<void>((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error(`failed to load ${src}`));
      document.head.appendChild(el);
    });
    scriptCache.set(src, p);
  }
  return p;
}

// 다음 우편번호 팝업을 열어 사용자가 고른 도로명 주소를 돌려준다. 취소 시 null.
export async function openAddressSearch(): Promise<AddressResult | null> {
  await loadScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
  return new Promise<AddressResult | null>((resolve) => {
    const w = window as any;
    let done = false;
    new w.daum.Postcode({
      oncomplete: (data: any) => {
        done = true;
        resolve({ address: data.roadAddress || data.jibunAddress || data.address, zonecode: data.zonecode });
      },
      // 선택 없이 닫으면(FORCE_CLOSE) null로 마무리한다.
      onclose: () => {
        if (!done) resolve(null);
      },
    }).open();
  });
}

let kakaoMapsReady: Promise<boolean> | null = null;
function ensureKakaoMaps(): Promise<boolean> {
  if (!kakaoMapsReady) {
    kakaoMapsReady = loadScript(
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`,
    )
      .then(
        () =>
          new Promise<boolean>((resolve) => {
            const w = window as any;
            if (w.kakao?.maps) w.kakao.maps.load(() => resolve(true));
            else resolve(false);
          }),
      )
      .catch(() => false);
  }
  return kakaoMapsReady;
}

async function geocodeKakao(address: string): Promise<Coords | null> {
  const ok = await ensureKakaoMaps();
  if (!ok) return null;
  const w = window as any;
  return new Promise<Coords | null>((resolve) => {
    try {
      const geocoder = new w.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === w.kakao.maps.services.Status.OK && result[0]) {
          resolve({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
        } else {
          resolve(null);
        }
      });
    } catch {
      resolve(null);
    }
  });
}

async function geocodeNominatim(address: string): Promise<Coords | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    const arr = await res.json();
    if (Array.isArray(arr) && arr[0]) {
      return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon) };
    }
  } catch {
    /* ignore */
  }
  return null;
}

// 주소를 좌표로 변환한다. 카카오 → Nominatim 순으로 시도하고, 모두 실패하면 null.
export async function geocodeAddress(address: string): Promise<Coords | null> {
  if (!address?.trim()) return null;
  return (await geocodeKakao(address)) || (await geocodeNominatim(address));
}
