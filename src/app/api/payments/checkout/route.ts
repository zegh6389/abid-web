import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import Stripe from 'stripe';
import { CheckoutSchema } from '@/lib/validation/payment';

// Minimal payment session API (mock) supporting card, Easypaisa, JazzCash
// In production, integrate with gateways (e.g., Stripe, Easypaisa/JazzCash APIs)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const { amount, currency = 'PKR', method, cart, orderId } = parsed.data;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (stripeSecret) {
      const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });
      const currencyNorm = (process.env.STRIPE_CURRENCY || currency || 'usd').toLowerCase();
      const amountMinor = Math.max(1, Math.round(Number(amount) * (currencyNorm === 'jpy' ? 1 : 100)));
      const originEnv = process.env.NEXT_PUBLIC_BASE_URL;
      const urlFromReq = new URL(req.url);
      const origin = originEnv || `${urlFromReq.protocol}//${urlFromReq.host}`;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: currencyNorm,
              product_data: { name: `Order ${orderId || ''}` },
              unit_amount: amountMinor,
            },
            quantity: 1,
          },
        ],
        metadata: orderId ? { orderId } : undefined,
        success_url: `${origin}/checkout/success?orderId=${encodeURIComponent(orderId || '')}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel?orderId=${encodeURIComponent(orderId || '')}`,
      });
      const db = await getDb();
      if (db && orderId) {
        await db.payment.updateMany({ where: { orderId }, data: { sessionId: session.id, provider: 'stripe' } });
      }
      return NextResponse.json({ ok: true, url: session.url, sessionId: session.id, provider: 'stripe' });
    }

    // Fallback mock flow when Stripe not configured
    const sessionId = `pay_${Math.random().toString(36).slice(2)}`;
    const db = await getDb();
    if (db && orderId) {
      await db.payment.updateMany({ where: { orderId }, data: { sessionId, provider: method } });
    }
    return NextResponse.json({ ok: true, sessionId, provider: method, amount, currency });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'error' }, { status: 400 });
  }
}


