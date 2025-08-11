export default function CheckoutCancelPage({ searchParams }: { searchParams?: { orderId?: string } }) {
  const orderId = searchParams?.orderId;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-4">
      <h1 className="text-2xl font-semibold">Payment canceled</h1>
      <p className="opacity-80">Your payment was canceled. {orderId ? `Order ${orderId} remains pending.` : ''}</p>
      <div className="flex gap-2">
        <a href="/checkout" className="px-4 py-2 rounded border">Return to checkout</a>
        <a href="/kids" className="px-4 py-2 rounded text-white gradient-cta">Continue shopping</a>
      </div>
    </div>
  );
}


