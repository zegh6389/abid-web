import { SupplierAdapter } from './types';
import { SpocketAdapter } from './spocket';
import { Wholesale2bAdapter } from './wholesale2b';
import { SynceeAdapter } from './syncee';
import { CjAdapter } from './cj';
import { ModalystAdapter } from './modalyst';
import { AutoDSAdapter } from './autods';

// Adapters will be imported when implemented
// Placeholder adapters with minimal stubs for now
class NoopAdapter implements SupplierAdapter {
  constructor(public name: string) {}
  async listProducts() { return { items: [], nextPageToken: null }; }
  async placeOrder() { return { supplierOrderId: 'noop', status: 'PLACED' as const }; }
  async getOrderStatus(id: string) { return { supplierOrderId: id, status: 'PLACED' as const }; }
}

export const SupplierRegistry: Record<string, SupplierAdapter> = {
  SPOCKET: new SpocketAdapter(process.env.SPOCKET_API_KEY || '', process.env.SPOCKET_WEBHOOK_SECRET || ''),
  WHOLESALE2B: new Wholesale2bAdapter(process.env.WHOLESALE2B_KEY || ''),
  SYNCREE: new SynceeAdapter(process.env.SYNCREE_API_KEY || ''),
  CJDROPSHIPPING: new CjAdapter(process.env.CJ_CLIENT_ID || '', process.env.CJ_SECRET || ''),
  MODALYST: new ModalystAdapter(process.env.MODALYST_TOKEN || ''),
  AUTODS: new AutoDSAdapter(process.env.AUTODS_API_KEY || ''),
};

export type SupplierKey = keyof typeof SupplierRegistry;
