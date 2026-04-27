export function createBundle({
    id,
    data,
    createdBy,
    destination
  }: {
    id: string;
    data: unknown;
    createdBy: string;
    destination: string;
  }) {
    if (!data) {
      throw new Error('Bundle data cannot be empty');
    }
  
    return {
      id,
      data,
      createdBy,
      createdAt: Date.now(),
      destination: destination
    };
  }