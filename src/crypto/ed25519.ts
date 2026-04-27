import crypto from 'crypto';

export function createEd25519Adapter(privateKeyPem: string) {
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const publicKey = crypto.createPublicKey(privateKey);

  return {
    async sign(payload: string) {
      const signature = crypto.sign(
        null,
        Buffer.from(payload),
        privateKey
      );

      return {
        signature: signature.toString('base64'),
        publicKey: publicKey
          .export({ type: 'spki', format: 'pem' })
          .toString()
      };
    },

    async verify({
      payload,
      signature,
      publicKey
    }: {
      payload: string;
      signature: string;
      publicKey: string;
    }) {
      const pubKeyObj = crypto.createPublicKey(publicKey);

      return crypto.verify(
        null,
        Buffer.from(payload),
        pubKeyObj,
        Buffer.from(signature, 'base64')
      );
    }
  };
}