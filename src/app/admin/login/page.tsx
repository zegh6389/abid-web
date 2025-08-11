import { login } from './actions';

export default function AdminLoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const err = searchParams?.error;
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      {err ? (
        <div className="mb-3 rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {err}
        </div>
      ) : null}
      <form action={login} className="space-y-3">
        <input name="email" type="email" placeholder="Email" required autoComplete="email" className="w-full border rounded px-3 py-2" />
        <input name="password" placeholder="Password" type="password" required autoComplete="current-password" className="w-full border rounded px-3 py-2" />
        <button className="bg-black text-white px-4 py-2 rounded" type="submit">Login</button>
      </form>
    </div>
  );
}
