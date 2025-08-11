'use client';

export default function ContactForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thanks! We will reply soon.');
  };
  return (
    <form className="space-y-3 mt-6 max-w-md" onSubmit={onSubmit}>
      <input type="text" placeholder="Name" className="w-full border rounded px-3 py-2" required />
      <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" required />
      <textarea placeholder="Message" className="w-full border rounded px-3 py-2" rows={5} required />
      <button type="submit" className="px-4 py-2 rounded bg-black text-white">Send</button>
    </form>
  );
}

