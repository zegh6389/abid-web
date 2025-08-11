async function fetchOrder(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/orders/${id}`, { cache: 'no-store' });
  return (await res.json()).order as any;
}

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const order = await fetchOrder(params.id);
  if (!order) return <div className="p-6">Not found</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order {order.id}</h1>
        <span className="text-sm px-2 py-1 rounded border">{order.status}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded p-4">
          <div className="font-medium mb-2">Items</div>
          <ul className="space-y-2">
            {order.items.map((it: any) => (
              <li key={it.id} className="text-sm flex items-center justify-between">
                <span>{it.title} × {it.quantity}</span>
                <span>{order.currency} {String(it.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">{order.currency} {String(order.total)}</span>
          </div>
        </div>
        <div className="glass rounded p-4 space-y-2">
          <div className="font-medium">Payment</div>
          <div className="text-sm">Provider: {order.payments?.[0]?.provider ?? '-'}</div>
          <div className="text-sm">Status: {order.payments?.[0]?.status ?? '-'}</div>
          <div className="text-sm">Session: {order.payments?.[0]?.sessionId ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}


