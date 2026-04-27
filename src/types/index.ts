export type ShareStatus = 'REQUESTED' | 'APPROVED' | 'RELAYED';

export interface ShareableBundle {
  id: string;
  data: unknown;
  createdBy: string;
  createdAt: number;
  expiresAt?: number;

  destination: string;

  publicKey?: string;
  signature?: string;
}

export interface ShareRequest {
  requestId: string;
  sourceUserId: string;
  destinationId: string;
  status: ShareStatus;
  metadata?: Record<string, any>;
  bundle?: ShareableBundle;
  createdAt: number;
  updatedAt: number;
}

export interface MessagingAdapter {
  sendMessage(input: {
    to: string;
    type: string;
    payload: any;
  }): Promise<void>;
}

export interface StorageAdapter {
  getRequest(requestId: string): Promise<ShareRequest | null>;
  saveRequest(request: ShareRequest): Promise<void>;
  updateRequest(
    requestId: string,
    updater: (req: ShareRequest) => ShareRequest
  ): Promise<ShareRequest>;
}

export interface PermissionAdapter {
  canShare(userId: string): Promise<boolean>;
}

export interface AsymmetricCryptoAdapter {
  sign(payload: string): Promise<{
    signature: string;
    publicKey: string;
  }>;

  verify(input: {
    payload: string;
    signature: string;
    publicKey: string;
  }): Promise<boolean>;
}

export interface ConsentoAdapters {
  messaging: MessagingAdapter;
  storage: StorageAdapter;
  permissions: PermissionAdapter;
  crypto: AsymmetricCryptoAdapter;
}