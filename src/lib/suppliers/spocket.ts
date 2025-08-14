import type { SupplierAdapter, SupplierProductDTO, PlaceOrderDTO, PlaceOrderResponse, OrderStatusResponse } from './types';

export class SpocketAdapter implements SupplierAdapter {
  name = 'Spocket';
  constructor(private apiKey: string) {}

  async listProducts() {
    const items: SupplierProductDTO[] = [
      {
        supplierSku: 'SPKT-TEST-001',
        title: 'Spocket Test Product',
        price: '1999',
        cost: '1000',
        quantity: 10,
        images: [],
      },
    ];
    return { items, nextPageToken: null };
  }

  async placeOrder(_payload: PlaceOrderDTO): Promise<PlaceOrderResponse> {
    return { supplierOrderId: 'SPKT-ORDER-TEST', status: 'PLACED' };
  }

  async getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse> {
    return { supplierOrderId, status: 'PLACED' };
  }
}
