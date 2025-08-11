async function fetchOrder(orderId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/orders/${orderId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.order ?? null;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: { searchParams?: { orderId?: string; session_id?: string } }) {
  const orderId = searchParams?.orderId ?? '';
  const order = orderId ? await fetchOrder(orderId) : null;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-4">
      <h1 className="text-2xl font-semibold">Payment successful</h1>
      {order ? (
        <div className="glass rounded p-4 space-y-2">
          <div className="text-sm">Order ID: <span className="font-mono">{order.id}</span></div>
          <div className="text-sm">Status: {order.status}</div>
          <div className="text-sm">Total: {order.currency} {String(order.total)}</div>
          <div className="mt-2">
            <div className="font-medium mb-1">Items</div>
            <ul className="text-sm space-y-1">
              {order.items?.map((it: any) => (
                <li key={it.id} className="flex items-center justify-between">
                  <span>{it.title} × {it.quantity}</span>
                  <span>{order.currency} {String(it.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="opacity-80">Thank you! Your payment was processed. If you created an order, it will appear in your account shortly.</div>
      )}
      <div className="pt-2">
        <a href="/kids" className="inline-block px-4 py-2 rounded text-white gradient-cta">Continue shopping</a>
      </div>
    </div>
  );
}


