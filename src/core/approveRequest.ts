import { ConsentoAdapters, ShareableBundle } from '../types';
import { assert } from '../utils/assert';
import { now } from '../utils/id';
import { getCanonicalBundlePayload } from '../crypto/canonical';

export async function approveShareRequest(input: {
  requestId: string;
  approverId: string;
  bundle: ShareableBundle;
  adapters: ConsentoAdapters;
}) {
  const { requestId, approverId, bundle, adapters } = input;

  const request = await adapters.storage.getRequest(requestId);
  assert(request, 'Request not found');

  const allowed = await adapters.permissions.canShare(approverId);
  assert(allowed, 'Permission denied');

  if (request.status !== 'REQUESTED') return request;
    assert(bundle.data !== undefined, 'Invalid bundle data');
    assert(bundle.id, 'Bundle must have id');
    assert(bundle.createdBy, 'Bundle must have creator');
    assert(
        bundle.destination === request.destinationId,
        'Destination mismatch'
    );

  const payload = getCanonicalBundlePayload(bundle);
  const { signature, publicKey } = await adapters.crypto.sign(payload);

  const signedBundle = { ...bundle, signature, publicKey };

  const updated = await adapters.storage.updateRequest(requestId, (req) => ({
    ...req,
    status: 'APPROVED',
    bundle: signedBundle,
    updatedAt: now()
  }));

  await adapters.messaging.sendMessage({
    to: request.sourceUserId,
    type: 'CONSENTO_APPROVED',
    payload: { requestId, bundle: signedBundle }
  });

  return updated;
}