import type {
  SupplierAdapter,
  SupplierProductDTO,
  PlaceOrderDTO,
  PlaceOrderResponse,
  OrderStatusResponse,
} from './types';

/**
 * Implementation for Modalyst.
 *
 * NOTE: This implementation is currently a stub. The official API documentation
 * is not publicly available and is required to complete the implementation.
 * It is likely available behind a developer portal.
 */
export class ModalystAdapter implements SupplierAdapter {
  name = 'Modalyst';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async listProducts(pageToken?: string): Promise<{ items: SupplierProductDTO[]; nextPageToken?: string | null }> {
    if (!this.apiKey) {
      console.warn('Modalyst API key is not set. Returning empty product list.');
      return { items: [], nextPageToken: null };
    }
    // TODO: Blocked pending API documentation.
    console.log('ModalystAdapter.listProducts called with pageToken:', pageToken);
    throw new Error('Modalyst adapter - listProducts is not implemented.');
  }

  async placeOrder(payload: PlaceOrderDTO): Promise<PlaceOrderResponse> {
    if (!this.apiKey) {
      throw new Error('Modalyst API key is not set.');
    }
    // TODO: Blocked pending API documentation.
    console.log('ModalystAdapter.placeOrder called with payload:', payload);
    throw new Error('Modalyst adapter - placeOrder is not implemented.');
  }

  async getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse> {
    if (!this.apiKey) {
      throw new Error('Modalyst API key is not set.');
    }
    // TODO: Blocked pending API documentation.
    console.log('ModalystAdapter.getOrderStatus called with supplierOrderId:', supplierOrderId);
    throw new Error('Modalyst adapter - getOrderStatus is not implemented.');
  }

  verifyWebhook(opts: { headers: Record<string, string | string[] | undefined>; rawBody: string }): boolean {
    // TODO: Blocked pending API documentation.
    console.log('ModalystAdapter.verifyWebhook called');
    throw new Error('Modalyst adapter - verifyWebhook is not implemented.');
  }
}
