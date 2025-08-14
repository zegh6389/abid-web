import { createHmac } from 'crypto';
import type {
  SupplierAdapter,
  SupplierProductDTO,
  PlaceOrderDTO,
  PlaceOrderResponse,
  OrderStatusResponse,
} from './types';

const API_BASE = 'https://api.spocket.co/api/v1';

export class SpocketAdapter implements SupplierAdapter {
  name = 'Spocket';
  private apiKey: string;
  private webhookSecret: string;

  constructor(apiKey: string, webhookSecret: string) {
    if (!apiKey || !webhookSecret) {
      throw new Error('Spocket API key and webhook secret are required');
    }
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  private async getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async listProducts(pageToken?: string): Promise<{ items: SupplierProductDTO[]; nextPageToken?: string | null }> {
    const url = new URL(`${API_BASE}/products`);
    url.searchParams.set('per_page', '50');
    if (pageToken) {
      url.searchParams.set('page', pageToken);
    }

    const response = await fetch(url.toString(), {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Spocket API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    // NOTE: This is an assumed mapping based on the DTO.
    // The actual API response structure might be different.
    const items: SupplierProductDTO[] = data.products.map((p: any) => ({
      supplierSku: p.id,
      title: p.title,
      description: p.description,
      images: p.images?.map((img: any) => img.src),
      price: p.variants?.[0]?.price,
      cost: p.variants?.[0]?.cost,
      quantity: p.variants?.[0]?.inventory_quantity,
    }));

    const nextPage = data.pagination?.next_page_url ? new URL(data.pagination.next_page_url).searchParams.get('page') : null;

    return { items, nextPageToken: nextPage };
  }

  async placeOrder(payload: PlaceOrderDTO): Promise<PlaceOrderResponse> {
    const url = `${API_BASE}/orders`;

    // NOTE: Assumed mapping from our DTO to Spocket's expected format.
    const spocketPayload = {
      retailer_order_id: payload.orderId,
      line_items: payload.items.map(item => ({
        supplier_sku: item.supplierSku,
        qty: item.quantity,
      })),
      shipping_address: payload.address,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(spocketPayload),
    });

    if (!response.ok) {
      throw new Error(`Spocket API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    return {
      supplierOrderId: data.order.id,
      status: data.order.status.toUpperCase(), // Assuming status matches our enum
    };
  }

  async getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse> {
    // NOTE: Endpoint is an assumption based on common REST patterns.
    const url = `${API_BASE}/orders/${supplierOrderId}`;

    const response = await fetch(url, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Spocket API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    return {
      supplierOrderId: data.order.id,
      status: data.order.status.toUpperCase(),
      trackingNumber: data.order.tracking_number,
      carrier: data.order.carrier,
    };
  }

  verifyWebhook(opts: { headers: Record<string, string | string[] | undefined>; rawBody: string }): boolean {
    const signature = opts.headers['x-spocket-signature'] as string;
    if (!signature) {
      return false;
    }

    const hmac = createHmac('sha256', this.webhookSecret);
    const computedSignature = hmac.update(opts.rawBody).digest('hex');

    return computedSignature === signature;
  }
}
