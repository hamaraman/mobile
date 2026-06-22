// 의존성 없이(Node 내장 zlib만 사용) 1200x630 기본 OG 이미지를 생성한다.
// 사진을 넣지 않은 청첩장의 링크 미리보기 폴백 이미지로 쓰인다.
// 카카오톡은 og:image가 너무 작으면(약 800px 미만) 무시하고 파비콘으로 폴백하므로,
// 표준 OG 크기(1200x630)의 충분히 큰 이미지가 필요하다.
//
// 실행: node scripts/generate-og-image.mjs  → public/og-image.png 갱신

import zlib from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const W = 1200;
const H = 630;

// 웨딩 팔레트
const bgTop = [253, 251, 247]; // #FDFBF7 크림
const bgBottom = [244, 235, 230]; // #F4EBE6 살짝 따뜻한 톤
const gold = [197, 162, 110]; // #C5A26E
const rose = [184, 142, 142]; // #B88E8E
const ink = [120, 100, 96]; // 보조 텍스트/라인

const buf = Buffer.alloc(W * H * 3);

function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function setPx(x, y, rgb) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  buf[i] = Math.round(rgb[0]);
  buf[i + 1] = Math.round(rgb[1]);
  buf[i + 2] = Math.round(rgb[2]);
}
function getPx(x, y) {
  const i = (y * W + x) * 3;
  return [buf[i], buf[i + 1], buf[i + 2]];
}
// 안티앨리어싱용 알파 블렌딩
function blend(x, y, rgb, alpha) {
  if (alpha <= 0) return;
  const base = getPx(x, y);
  setPx(x, y, lerp(base, rgb, Math.min(1, alpha)));
}

// 1) 세로 그라데이션 배경
for (let y = 0; y < H; y++) {
  const row = lerp(bgTop, bgBottom, y / (H - 1));
  for (let x = 0; x < W; x++) setPx(x, y, row);
}

// 2) 가는 안쪽 테두리 프레임
const margin = 48;
for (let y = margin; y < H - margin; y++) {
  for (const x of [margin, W - margin]) blend(x, y, ink, 0.25);
}
for (let x = margin; x < W - margin; x++) {
  for (const y of [margin, H - margin]) blend(x, y, ink, 0.25);
}

// 3) 두 개의 겹친 웨딩 링 (가운데)
function drawRing(cx, cy, radius, stroke, color) {
  const half = stroke / 2;
  const x0 = Math.floor(cx - radius - stroke);
  const x1 = Math.ceil(cx + radius + stroke);
  const y0 = Math.floor(cy - radius - stroke);
  const y1 = Math.ceil(cy + radius + stroke);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const edge = Math.abs(d - radius); // 링 중심선과의 거리
      // 1px 폭으로 부드럽게 떨어지는 알파
      const alpha = Math.max(0, Math.min(1, half + 0.5 - edge));
      if (alpha > 0) blend(x, y, color, alpha);
    }
  }
}

const cy = 285;
drawRing(545, cy, 110, 12, gold);
drawRing(655, cy, 110, 12, rose);

// 4) 링 아래 가는 구분선
const lineY = 470;
for (let x = W / 2 - 60; x <= W / 2 + 60; x++) blend(x, lineY, ink, 0.5);

// --- PNG 인코딩 (colortype 2 = RGB) ---
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type RGB
// 10,11,12 = 0 (deflate, no filter, no interlace)

// 스캔라인마다 필터 바이트 0을 붙인다.
const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0;
  buf.copy(raw, y * (1 + W * 3) + 1, y * W * 3, (y + 1) * W * 3);
}
const idat = zlib.deflateSync(raw, { level: 9 });

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og-image.png');
writeFileSync(out, png);
console.log(`wrote ${out} (${png.length} bytes, ${W}x${H})`);
