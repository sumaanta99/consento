import {
    createShareRequest,
    approveShareRequest,
    relayShareBundle,
    createEd25519Adapter,
    createBundle
  } from '../../src';
  import crypto from 'crypto';
  
  // 🔐 generate key (dev only)
  const { privateKey } = crypto.generateKeyPairSync('ed25519');
  
  const adapters = {
    messaging: {
      async sendMessage(msg: any) {
        console.log('📨', msg.type, msg.payload);
      }
    },
    storage: {
      db: new Map(),
      async getRequest(id: string) {
        return this.db.get(id) || null;
      },
      async saveRequest(req: any) {
        this.db.set(req.requestId, req);
      },
      async updateRequest(id: string, updater: any) {
        const updated = updater(this.db.get(id));
        this.db.set(id, updated);
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
  };
  
  (async () => {
    console.log('🚀 Starting Consento demo...\n');
  
    const request = await createShareRequest({
      sourceUserId: 'userA',
      destinationId: 'userB',
      adapters
    });
  

const bundle = createBundle({
    id: 'bundle-1',
    data: { phone: '1234567890' },
    createdBy: 'userA',
    destination: 'userB'
  });
    await approveShareRequest({
      requestId: request.requestId,
      approverId: 'userA',
      bundle: bundle,
      adapters
    });
  
    await relayShareBundle({
      requestId: request.requestId,
      relayerId: 'userX',
      adapters
    });
  
    console.log('\n✅ Flow completed successfully');
  })();