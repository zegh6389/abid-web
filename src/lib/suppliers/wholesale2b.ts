import type {
  SupplierAdapter,
  SupplierProductDTO,
  PlaceOrderDTO,
  PlaceOrderResponse,
  OrderStatusResponse,
} from './types';

/**
 * Implementation for Wholesale2B.
 *
 * NOTE: This implementation is currently a stub. The official API documentation
 * is not publicly available and is required to complete the implementation.
 * The marketing page suggests a full REST API with webhooks exists.
 * An alternative CSV file download method also seems to be available.
 */
export class Wholesale2bAdapter implements SupplierAdapter {
  name = 'Wholesale2B';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async listProducts(pageToken?: string): Promise<{ items: SupplierProductDTO[]; nextPageToken?: string | null }> {
    if (!this.apiKey) {
      console.warn('Wholesale2B API key is not set. Returning empty product list.');
      return { items: [], nextPageToken: null };
    }
    // TODO: Blocked pending API documentation.
    // This method should call the Wholesale2B API to get a paginated list of products.
    console.log('Wholesale2bAdapter.listProducts called with pageToken:', pageToken);
    throw new Error('Wholesale2B adapter - listProducts is not implemented.');
  }

  async placeOrder(payload: PlaceOrderDTO): Promise<PlaceOrderResponse> {
    if (!this.apiKey) {
      throw new Error('Wholesale2B API key is not set.');
    }
    // TODO: Blocked pending API documentation.
    // This method should call the Wholesale2B API to place an order.
    console.log('Wholesale2bAdapter.placeOrder called with payload:', payload);
    throw new Error('Wholesale2B adapter - placeOrder is not implemented.');
  }

  async getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse> {
    if (!this.apiKey) {
      throw new Error('Wholesale2B API key is not set.');
    }
    // TODO: Blocked pending API documentation.
    // This method should call the Wholesale2B API to get order status.
    console.log('Wholesale2bAdapter.getOrderStatus called with supplierOrderId:', supplierOrderId);
    throw new Error('Wholesale2B adapter - getOrderStatus is not implemented.');
  }

  verifyWebhook(opts: { headers: Record<string, string | string[] | undefined>; rawBody: string }): boolean {
    // TODO: Blocked pending API documentation.
    // The marketing page mentions webhooks are available.
    // Implementation requires knowing the signature algorithm and secret.
    console.log('Wholesale2bAdapter.verifyWebhook called');
    throw new Error('Wholesale2B adapter - verifyWebhook is not implemented.');
  }
}
