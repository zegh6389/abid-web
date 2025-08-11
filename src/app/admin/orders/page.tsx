async function fetchOrders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/orders?limit=50`, { cache: 'no-store' });
  const data = await res.json();
  return (Array.isArray(data?.orders) ? data.orders : []) as any[];
}

export default async function AdminOrdersPage() {
  // For simplicity, call the index route and expect an array. If not implemented, show empty state.
  const orders = await fetchOrders();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="grid gap-2">
        {orders.length === 0 ? (
          <div className="text-sm opacity-70">No orders yet.</div>
        ) : (
          orders.map((o) => (
            <a key={o.id} href={`/admin/orders/${o.id}`} className="glass rounded p-3 flex items-center justify-between hover:bg-gray-50">
              <div>
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-gray-500">{o.status} · {o.currency} {o.total}</div>
              </div>
              <span className="text-blue-600 text-sm">View</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}


