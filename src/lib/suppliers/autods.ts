import type {
  SupplierAdapter,
  SupplierProductDTO,
  PlaceOrderDTO,
  PlaceOrderResponse,
  OrderStatusResponse,
} from './types';

/**
 * Implementation for AutoDS.
 *
 * NOTE: This implementation is currently a stub. The official API documentation
 * is not publicly available and is required to complete the implementation.
 * The website has a contact form for API access, suggesting it is a gated service.
 */
export class AutoDSAdapter implements SupplierAdapter {
  name = 'AutoDS';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async listProducts(pageToken?: string): Promise<{ items: SupplierProductDTO[]; nextPageToken?: string | null }> {
    if (!this.apiKey) {
      console.warn('AutoDS API key is not set. Returning empty product list.');
      return { items: [], nextPageToken: null };
    }
    // TODO: Blocked pending API documentation.
    console.log('AutoDSAdapter.listProducts called with pageToken:', pageToken);
    throw new Error('AutoDS adapter - listProducts is not implemented.');
  }

  async placeOrder(payload: PlaceOrderDTO): Promise<PlaceOrderResponse> {
    if (!this.apiKey) {
      throw new Error('AutoDS API key is not set.');
    }
    // TODO: Blocked pending API documentation.
    console.log('AutoDSAdapter.placeOrder called with payload:', payload);
    throw new Error('AutoDS adapter - placeOrder is not implemented.');
  }

  async getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse> {
    if (!this.apiKey) {
      throw new Error('AutoDS API key is not set.');
    }
    // TODO: Blocked pending API documentation.
    console.log('AutoDSAdapter.getOrderStatus called with supplierOrderId:', supplierOrderId);
    throw new Error('AutoDS adapter - getOrderStatus is not implemented.');
  }

  verifyWebhook(opts: { headers: Record<string, string | string[] | undefined>; rawBody: string }): boolean {
    // TODO: Blocked pending API documentation.
    console.log('AutoDSAdapter.verifyWebhook called');
    throw new Error('AutoDS adapter - verifyWebhook is not implemented.');
  }
}
