import type {
  SupplierAdapter,
  SupplierProductDTO,
  PlaceOrderDTO,
  PlaceOrderResponse,
  OrderStatusResponse,
} from './types';
import { getDb } from '@/lib/db/client';
import { SupplierType } from '@prisma/client';

const API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

interface CjAuth {
  accessToken: string;
  accessTokenExpiryDate: string;
  refreshToken: string;
  refreshTokenExpiryDate: string;
}

/**
 * Implementation for CJDropshipping.
 * This adapter includes logic for OAuth-like token management.
 */
export class CjAdapter implements SupplierAdapter {
  name = 'CJDropshipping';
  private clientId: string; // This will be the user's email for CJ
  private clientSecret: string; // This will be the user's API Key for CJ

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAuthToken(): Promise<string> {
    const prisma = await getDb();
    if (!prisma) throw new Error('DB client not available');

    const supplier = await prisma.supplier.findUnique({
      where: { name: this.name },
    });

    let auth = supplier?.authJson as CjAuth | null;

    // Check if token exists and is not expired
    if (auth?.accessToken && new Date(auth.accessTokenExpiryDate) > new Date()) {
      return auth.accessToken;
    }

    // If token is expired or doesn't exist, try to refresh it
    if (auth?.refreshToken && new Date(auth.refreshTokenExpiryDate) > new Date()) {
      try {
        const refreshedAuth = await this.refreshAccessToken(auth.refreshToken);
        await prisma.supplier.update({
          where: { name: this.name },
          data: { authJson: refreshedAuth as any },
        });
        return refreshedAuth.accessToken;
      } catch (error) {
        console.error('Failed to refresh CJDropshipping token, getting a new one.', error);
        // Fall through to get a new token if refresh fails
      }
    }

    // If no refresh token or refresh failed, get a new access token
    const newAuth = await this.getNewAccessToken();
    await prisma.supplier.upsert({
      where: { name: this.name },
      update: { authJson: newAuth as any },
      create: {
        name: this.name,
        type: SupplierType.CJDROPSHIPPING,
        authJson: newAuth as any,
        active: true,
      },
    });

    return newAuth.accessToken;
  }

  private async getNewAccessToken(): Promise<CjAuth> {
    const response = await fetch(`${API_BASE}/authentication/getAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.clientId,
        password: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`CJDropshipping auth error: ${response.status} ${await response.text()}`);
    }
    const data = await response.json();
    if (!data.result) {
      throw new Error(`CJDropshipping auth failed: ${data.message}`);
    }
    return data.data;
  }

  private async refreshAccessToken(refreshToken: string): Promise<CjAuth> {
    const response = await fetch(`${API_BASE}/authentication/refreshAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`CJDropshipping token refresh error: ${response.status} ${await response.text()}`);
    }
    const data = await response.json();
    if (!data.result) {
      throw new Error(`CJDropshipping token refresh failed: ${data.message}`);
    }
    return data.data;
  }

  async listProducts(pageToken: string = '1'): Promise<{ items: SupplierProductDTO[]; nextPageToken?: string | null }> {
    const token = await this.getAuthToken();
    const url = new URL(`${API_BASE}/product/list`);
    url.searchParams.set('pageNum', pageToken);
    url.searchParams.set('pageSize', '50'); // Or make this configurable

    const response = await fetch(url.toString(), {
      headers: { 'CJ-Access-Token': token },
    });

    if (!response.ok) {
      throw new Error(`CJDropshipping API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    if (!data.result) {
      throw new Error(`CJDropshipping API error: ${data.message}`);
    }

    const items: SupplierProductDTO[] = data.data.list.map((p: any) => ({
      supplierSku: p.productSku,
      title: p.productNameEn,
      images: [p.productImage],
      price: p.sellPrice.toString(),
      // Inventory requires a separate call, so it's omitted for now.
      quantity: 0,
    }));

    const nextPage = data.data.pageNum < data.data.total / data.data.pageSize
      ? (parseInt(pageToken, 10) + 1).toString()
      : null;

    return { items, nextPageToken: nextPage };
  }

  async placeOrder(payload: PlaceOrderDTO): Promise<PlaceOrderResponse> {
    const token = await this.getAuthToken();
    const url = `${API_BASE}/shopping/order/createOrderV2`;

    // Map our generic DTO to the CJ-specific payload
    const cjPayload = {
      orderNumber: payload.orderId,
      shippingZip: payload.address.postalCode,
      shippingCountryCode: payload.address.country,
      shippingCountry: payload.address.country, // Assuming country code and name are the same for this purpose
      shippingProvince: payload.address.state,
      shippingCity: payload.address.city,
      shippingPhone: 'N/A', // Assuming phone is not available in our DTO
      shippingCustomerName: payload.address.name,
      shippingAddress: payload.address.line1,
      shippingAddress2: payload.address.line2,
      logisticName: 'CJPacket Ordinary', // Using a default as per docs
      fromCountryCode: 'CN', // Assuming shipping from China
      products: payload.items.map(item => ({
        vid: item.supplierSku, // Assuming supplierSku is the CJ 'vid'
        quantity: item.quantity,
      })),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': token,
      },
      body: JSON.stringify(cjPayload),
    });

    if (!response.ok) {
      throw new Error(`CJDropshipping API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    if (!data.result) {
      throw new Error(`CJDropshipping API error: ${data.message}`);
    }

    return {
      supplierOrderId: data.data.orderId,
      status: 'PLACED', // CJ creates the order, we assume PLACED status
    };
  }

  async getOrderStatus(supplierOrderId: string): Promise<OrderStatusResponse> {
    const token = await this.getAuthToken();
    const url = new URL(`${API_BASE}/shopping/order/getOrderDetail`);
    url.searchParams.set('orderId', supplierOrderId);

    const response = await fetch(url.toString(), {
      headers: { 'CJ-Access-Token': token },
    });

    if (!response.ok) {
      throw new Error(`CJDropshipping API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    if (!data.result) {
      throw new Error(`CJDropshipping API error: ${data.message}`);
    }

    const order = data.data;
    const statusMap: Record<string, 'PLACED' | 'SHIPPED' | 'CANCELLED'> = {
      CREATED: 'PLACED',
      IN_CART: 'PLACED',
      UNPAID: 'PLACED',
      UNSHIPPED: 'PLACED',
      SHIPPED: 'SHIPPED',
      DELIVERED: 'SHIPPED', // Consider DELIVERED as SHIPPED for our enum
      CANCELLED: 'CANCELLED',
    };

    return {
      supplierOrderId: order.orderId,
      status: statusMap[order.orderStatus] || 'PLACED',
      trackingNumber: order.trackNumber,
      carrier: order.logisticName,
    };
  }

  verifyWebhook(opts: { headers: Record<string, string | string[] | undefined>; rawBody: string }): boolean {
    // TODO: Blocked pending webhook verification documentation.
    // The public documentation does not specify a method for verifying
    // the authenticity of incoming webhooks (e.g., via HMAC signature).
    console.warn('CJDropshipping webhook verification is not implemented and is currently insecure.');
    return true; // Bypassing verification - NOT SAFE FOR PRODUCTION
  }
}
