export default function AdminHome() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <ul className="list-disc pl-5 space-y-1">
        <li><a className="underline" href="/admin/products">Products</a></li>
        <li><a className="underline" href="/admin/orders">Orders</a></li>
      </ul>
    </div>
  );
}
