import { ShareableBundle } from '../types';

export function getCanonicalBundlePayload(bundle: ShareableBundle): string {
  return JSON.stringify({
    id: bundle.id,
    data: bundle.data,
    createdBy: bundle.createdBy,
    createdAt: bundle.createdAt,
    expiresAt: bundle.expiresAt ?? null,
    destination: bundle.destination
  });
}