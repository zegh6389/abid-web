export type DecimalString = string; // use strings for currency to avoid float issues

export interface SupplierProductDTO {
  supplierSku: string;
  title: string;
  description?: string;
  images?: string[];
  price: DecimalString; // sell price suggestion
  cost?: DecimalString;
  quantity: number;
  options?: Array<{ name: string; value: string }>; // size, color
}

export interface PlaceOrderItemDTO {
  supplierSku: string;
  quantity: number;
  title?: string;
}

export interface PlaceOrderDTO {
  orderId: string; // internal order id
  currency: string;
  email?: string;
  name?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: PlaceOrderItemDTO[];
}

export interface PlaceOrderResponse {
  supplierOrderId: string;
  status: 'PLACED' | 'ACCEPTED' | 'SHIPPED' | 'CANCELLED';
}

export interface OrderStatusResponse {
  supplierOrderId: string;
  status: 'PLACED' | 'ACCEPTED' | 'SHIPPED' | 'CANCELLED';
  trackingNumber?: string;
  carrier?: string;
}

export interface SupplierAdapter {
  name: string;
  listProducts(pageToken?: string): Promise<{ items: SupplierProductDTO[]; nextPageToken?: string | null }>;
  placeOrder(payload: PlaceOrderDTO): Promise<PlaceOrderResponse>;
  getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse>;
  // Provide a generic webhook verifier signature to avoid framework coupling
  verifyWebhook?(opts: { headers: Record<string, string | string[] | undefined>; rawBody: string }): Promise<boolean> | boolean;
}
