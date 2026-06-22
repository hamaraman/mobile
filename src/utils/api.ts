import type { WeddingData } from '../types/wedding';

// 청첩장 백엔드(Cloudflare Pages Functions) 호출 헬퍼.

export type PublishResult = { id: string; editToken: string };

export async function publishInvitation(data: WeddingData): Promise<PublishResult> {
  const res = await fetch('/api/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '저장에 실패했습니다.');
  return body as PublishResult;
}

export async function fetchInvitation(id: string): Promise<WeddingData> {
  const res = await fetch(`/api/invitations/${encodeURIComponent(id)}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '청첩장을 불러올 수 없습니다.');
  return body.data as WeddingData;
}

export async function updateInvitation(id: string, editToken: string, data: WeddingData): Promise<void> {
  const res = await fetch(`/api/invitations/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ editToken, data }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '수정에 실패했습니다.');
}
