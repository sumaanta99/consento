import { describe, it, expect } from 'vitest';
import {
  createShareRequest,
  approveShareRequest,
  relayShareBundle,
  createEd25519Adapter
} from '../src';
import crypto from 'crypto';

function setup() {
  const { privateKey } = crypto.generateKeyPairSync('ed25519');

  const db = new Map();

  return {
    adapters: {
      messaging: { sendMessage: async () => {} },
      storage: {
        async getRequest(id: string) {
          return db.get(id) || null;
        },
        async saveRequest(req: any) {
          db.set(req.requestId, req);
        },
        async updateRequest(id: string, updater: any) {
          const updated = updater(db.get(id));
          db.set(id, updated);
          return updated;
        }
      },
      permissions: {
        async canShare() {
          return true;
        }
      },
      crypto: createEd25519Adapter(
        privateKey.export({ format: 'pem', type: 'pkcs8' }).toString()
      )
    }
  };
}

describe('Consento Core', () => {
  it('prevents relay before approval', async () => {
    const { adapters } = setup();

    const req = await createShareRequest({
      sourceUserId: 'A',
      destinationId: 'B',
      adapters
    });

    await expect(
      relayShareBundle({
        requestId: req.requestId,
        relayerId: 'X',
        adapters
      })
    ).rejects.toThrow();
  });

  it('rejects wrong destination', async () => {
    const { adapters } = setup();

    const req = await createShareRequest({
      sourceUserId: 'A',
      destinationId: 'B',
      adapters
    });

    await expect(
      approveShareRequest({
        requestId: req.requestId,
        approverId: 'A',
        bundle: {
          id: '1',
          data: {},
          createdBy: 'A',
          createdAt: Date.now(),
          destination: 'WRONG'
        },
        adapters
      })
    ).rejects.toThrow();
  });

  it('rejects tampered bundle', async () => {
    const { adapters } = setup();

    const req = await createShareRequest({
      sourceUserId: 'A',
      destinationId: 'B',
      adapters
    });

    const approved = await approveShareRequest({
      requestId: req.requestId,
      approverId: 'A',
      bundle: {
        id: '1',
        data: { x: 1 },
        createdBy: 'A',
        createdAt: Date.now(),
        destination: 'B'
      },
      adapters
    });

    // tamper
    approved.bundle!.data = { hacked: true };

    await expect(
      relayShareBundle({
        requestId: req.requestId,
        relayerId: 'X',
        adapters
      })
    ).rejects.toThrow();
  });
});