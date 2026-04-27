import { ConsentoAdapters } from '../types';
import { assert } from '../utils/assert';
import { now } from '../utils/id';
import { getCanonicalBundlePayload } from '../crypto/canonical';

export async function relayShareBundle(input: {
  requestId: string;
  relayerId: string;
  adapters: ConsentoAdapters;
}) {
  const { requestId, relayerId, adapters } = input;

  const request = await adapters.storage.getRequest(requestId);
  assert(request, 'Request not found');
  assert(request.bundle, 'Bundle missing');

  if (request.status === 'RELAYED') return request;

  assert(request.status === 'APPROVED', 'Not approved');

  const bundle = request.bundle;

  assert(bundle.signature && bundle.publicKey, 'Invalid bundle');

  assert(
    bundle.destination === request.destinationId,
    'Destination mismatch'
  );

  if (bundle.expiresAt) {
    assert(Date.now() < bundle.expiresAt, 'Expired bundle');
  }

  const payload = getCanonicalBundlePayload(bundle);

  const valid = await adapters.crypto.verify({
    payload,
    signature: bundle.signature,
    publicKey: bundle.publicKey
  });

  assert(valid, 'Signature invalid');

  await adapters.messaging.sendMessage({
    to: request.destinationId,
    type: 'CONSENTO_BUNDLE',
    payload: {
      requestId,
      bundle,
      relayedBy: relayerId
    }
  });

  return adapters.storage.updateRequest(requestId, (req) => ({
    ...req,
    status: 'RELAYED',
    updatedAt: now()
  }));
}