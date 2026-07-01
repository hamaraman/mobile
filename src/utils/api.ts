import type { WeddingData } from '../types/wedding';

// 청첩장 백엔드(Cloudflare Pages Functions) 호출 헬퍼.

export type PublishResult = { id: string; editToken: string };

// 인증이 필요한 요청은 쿠키(session)를 함께 보내야 하므로 credentials를 명시한다.
const CREDS: RequestInit = { credentials: 'same-origin' };

export class UnauthorizedError extends Error {
  constructor(message = '로그인이 필요합니다.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function publishInvitation(data: WeddingData): Promise<PublishResult> {
  const res = await fetch('/api/invitations', {
    ...CREDS,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new UnauthorizedError(body.error);
  if (!res.ok) throw new Error(body.error || '저장에 실패했습니다.');
  return body as PublishResult;
}

export async function fetchInvitation(id: string): Promise<WeddingData> {
  const res = await fetch(`/api/invitations/${encodeURIComponent(id)}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '청첩장을 불러올 수 없습니다.');
  return body.data as WeddingData;
}

// editToken은 로그인 소유자라면 없어도 된다(서버가 소유권으로 통과시킴).
export async function updateInvitation(id: string, editToken: string | null, data: WeddingData): Promise<void> {
  const res = await fetch(`/api/invitations/${encodeURIComponent(id)}`, {
    ...CREDS,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ editToken, data }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '수정에 실패했습니다.');
}

// ── 인증 / 내 청첩장 ────────────────────────────────────────────────────────

export type AuthUser = { uid: string; name: string };

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', CREDS);
    const body = await res.json().catch(() => ({}));
    return (body.user as AuthUser) ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { ...CREDS, method: 'POST' });
}

export type InvitationSummary = {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  updatedAt: number;
};

export async function fetchMyInvitations(): Promise<InvitationSummary[]> {
  const res = await fetch('/api/my/invitations', CREDS);
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new UnauthorizedError(body.error);
  if (!res.ok) throw new Error(body.error || '목록을 불러올 수 없습니다.');
  return (body.invitations as InvitationSummary[]) || [];
}

export async function deleteInvitation(id: string): Promise<void> {
  const res = await fetch(`/api/invitations/${encodeURIComponent(id)}`, {
    ...CREDS,
    method: 'DELETE',
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new UnauthorizedError(body.error);
  if (!res.ok) throw new Error(body.error || '삭제에 실패했습니다.');
}

// 카카오 로그인 시작(리다이렉트). 로그인 후 /?mine 으로 복귀한다.
export function startKakaoLogin(): void {
  window.location.href = '/api/auth/kakao';
}
