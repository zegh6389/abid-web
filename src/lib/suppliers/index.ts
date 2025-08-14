import { SupplierAdapter } from './types';
import { SpocketAdapter } from './spocket';

// Adapters will be imported when implemented
// Placeholder adapters with minimal stubs for now
class NoopAdapter implements SupplierAdapter {
  constructor(public name: string) {}
  async listProducts() { return { items: [], nextPageToken: null }; }
  async placeOrder() { return { supplierOrderId: 'noop', status: 'PLACED' as const }; }
  async getOrderStatus(id: string) { return { supplierOrderId: id, status: 'PLACED' as const }; }
}

export const SupplierRegistry: Record<string, SupplierAdapter> = {
  SPOCKET: new SpocketAdapter(process.env.SPOCKET_API_KEY || ''),
  WHOLESALE2B: new NoopAdapter('Wholesale2B'),
  SYNCREE: new NoopAdapter('Syncee'),
  CJDROPSHIPPING: new NoopAdapter('CJ Dropshipping'),
  MODALYST: new NoopAdapter('Modalyst'),
  AUTODS: new NoopAdapter('AutoDS'),
};

export type SupplierKey = keyof typeof SupplierRegistry;
