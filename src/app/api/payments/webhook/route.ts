import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getDb } from '@/lib/db/client';
import Stripe from 'stripe';
import { WebhookMockSchema } from '@/lib/validation/payment';

// Mock webhook to confirm payment and mark order paid, decrementing inventory.
export async function POST(req: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const db = await getDb();
    if (!db) return NextResponse.json({ error: 'DB not available' }, { status: 503 });

    if (stripeSecret && stripeWebhookSecret) {
      const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });
      const sig = headers().get('stripe-signature');
      const rawBody = await req.text();
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig as string, stripeWebhookSecret);
      } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = (session.metadata?.orderId as string) || null;
        if (orderId) {
          const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
          if (order) {
            await db.$transaction(async (tx: any) => {
              await tx.payment.updateMany({ where: { orderId }, data: { status: 'PAID', sessionId: session.id, provider: 'stripe' } });
              await tx.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
              for (const it of order.items) {
                if (it.variantId) {
                  await tx.inventory.updateMany({ where: { variantId: it.variantId }, data: { stock: { decrement: it.quantity } } });
                }
              }
            });
          }
        }
      }

      return NextResponse.json({ received: true });
    }

    // Fallback mock behavior when Stripe not configured
    const body = await req.json();
    const parsed = WebhookMockSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'BAD_REQUEST', errors: parsed.error.flatten() }, { status: 400 });
    }
    const { orderId, sessionId, success = true } = parsed.data;
    const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true, payments: true } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (!success) {
      await db.$transaction([
        db.payment.updateMany({ where: { orderId }, data: { status: 'FAILED' } }),
        db.order.update({ where: { id: orderId }, data: { status: 'FAILED' } }),
      ] as any);
      return NextResponse.json({ ok: true, orderId, status: 'FAILED' });
    }
    await db.$transaction(async (tx: any) => {
      await tx.payment.updateMany({ where: { orderId }, data: { status: 'PAID', sessionId: sessionId || undefined } });
      await tx.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
      for (const it of order.items) {
        if (it.variantId) {
          await tx.inventory.updateMany({ where: { variantId: it.variantId }, data: { stock: { decrement: it.quantity } } });
        }
      }
    });
    const updated = await db.order.findUnique({ where: { id: orderId }, include: { items: true, payments: true } });
    return NextResponse.json({ ok: true, order: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 400 });
  }
}


