// 세션/인증 공용 헬퍼. `_` 접두사 폴더라 라우트로 취급되지 않고 import만 된다.
// 별도 세션 저장소 없이 HMAC-SHA256으로 서명한 stateless 쿠키를 쓴다.
//   payload(JSON) → base64url  +  "."  +  base64url(HMAC(payload))
// 서버만 SESSION_SECRET을 알기 때문에 위조가 불가능하다.

const SESSION_COOKIE = 'session';
const STATE_COOKIE = 'oauth_state';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30일(초)

// ── base64url ─────────────────────────────────────────────────────────────
function toBase64Url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

const encoder = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return toBase64Url(new Uint8Array(sig));
}

// 타이밍 안전 비교
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── 세션 토큰 ─────────────────────────────────────────────────────────────
// payload에 exp(만료 시각, ms)를 넣어 서명한다.
export async function signSession(payload, secret) {
  const body = { ...payload, exp: Date.now() + SESSION_MAX_AGE * 1000 };
  const encoded = toBase64Url(encoder.encode(JSON.stringify(body)));
  const sig = await hmac(secret, encoded);
  return `${encoded}.${sig}`;
}

export async function verifySession(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const encoded = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmac(secret, encoded);
  if (!timingSafeEqual(sig, expected)) return null;
  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded)));
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

// ── 쿠키 ──────────────────────────────────────────────────────────────────
export function parseCookies(request) {
  const header = request.headers.get('Cookie') || '';
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const name = part.slice(0, idx).trim();
    if (name) out[name] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function serializeCookie(name, value, maxAge) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ];
  parts.push(`Max-Age=${maxAge}`);
  return parts.join('; ');
}

export function sessionCookie(value) {
  return serializeCookie(SESSION_COOKIE, value, SESSION_MAX_AGE);
}

// 로그아웃/만료용 — 즉시 만료시키는 쿠키
export function clearCookie(name) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

// CSRF 방지용 state 쿠키(짧은 수명, 콜백에서 대조)
export function stateCookie(value) {
  return serializeCookie(STATE_COOKIE, value, 60 * 10); // 10분
}

// ── 현재 로그인 사용자 ────────────────────────────────────────────────────
// 유효한 세션 쿠키가 있으면 { uid, name } 반환, 아니면 null.
export async function getUser(request, env) {
  if (!env.SESSION_SECRET) return null;
  const cookies = parseCookies(request);
  const payload = await verifySession(cookies[SESSION_COOKIE], env.SESSION_SECRET);
  if (!payload || !payload.uid) return null;
  return { uid: String(payload.uid), name: payload.name || '' };
}

export const COOKIES = { SESSION: SESSION_COOKIE, STATE: STATE_COOKIE };
