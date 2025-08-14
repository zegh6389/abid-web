import type {
  SupplierAdapter,
  SupplierProductDTO,
  PlaceOrderDTO,
  PlaceOrderResponse,
  OrderStatusResponse,
} from './types';

/**
 * Implementation for Syncee.
 *
 * NOTE: This implementation is currently a stub. The official documentation indicates
 * that Syncee primarily uses a data feed file (CSV, XML, JSON) for product integration,
 * which can be fetched from a URL or FTP. This is incompatible with the current
 * application's REST-based, paginated catalog sync job.
 *
 * A full implementation would require modifying the generic sync job to support
 * downloading and parsing files, which is a significant architectural change.
 */
export class SynceeAdapter implements SupplierAdapter {
  name = 'Syncee';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async listProducts(pageToken?: string): Promise<{ items: SupplierProductDTO[]; nextPageToken?: string | null }> {
    if (!this.apiKey) {
      console.warn('Syncee API key is not set. Cannot fetch data feed.');
      return { items: [], nextPageToken: null };
    }
    // TODO: Blocked due to file-based data feed integration.
    // A REST API for products is not available for self-serve integration.
    console.log('SynceeAdapter.listProducts called with pageToken:', pageToken);
    throw new Error('Syncee adapter - listProducts is not implemented due to incompatible integration method.');
  }

  async placeOrder(payload: PlaceOrderDTO): Promise<PlaceOrderResponse> {
    if (!this.apiKey) {
      throw new Error('Syncee API key is not set.');
    }
    // TODO: Blocked pending API documentation for order placement.
    // It is unclear if order placement can be done via a REST API.
    console.log('SynceeAdapter.placeOrder called with payload:', payload);
    throw new Error('Syncee adapter - placeOrder is not implemented.');
  }

  async getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse> {
    if (!this.apiKey) {
      throw new Error('Syncee API key is not set.');
    }
    // TODO: Blocked pending API documentation for order status.
    console.log('SynceeAdapter.getOrderStatus called with supplierOrderId:', supplierOrderId);
    throw new Error('Syncee adapter - getOrderStatus is not implemented.');
  }
}
