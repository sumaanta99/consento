import { ConsentoAdapters, ShareRequest } from '../types';
import { generateId, now } from '../utils/id';

export async function createShareRequest(input: {
  sourceUserId: string;
  destinationId: string;
  metadata?: Record<string, any>;
  adapters: ConsentoAdapters;
}): Promise<ShareRequest> {
  const { sourceUserId, destinationId, metadata, adapters } = input;

  const requestId = generateId();
  const timestamp = now();

  const request: ShareRequest = {
    requestId,
    sourceUserId,
    destinationId,
    status: 'REQUESTED',
    metadata,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await adapters.storage.saveRequest(request);

  await adapters.messaging.sendMessage({
    to: sourceUserId,
    type: 'CONSENTO_REQUEST',
    payload: { requestId, destinationId, metadata }
  });

  return request;
}