'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  variantId: string;
  className?: string;
};

export default function Uploader({ variantId, className }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      e.currentTarget.value = '';
      return;
    }
    // 10 MB limit (adjust as needed)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert('File too large. Max 10 MB.');
      e.currentTarget.value = '';
      return;
    }
    try {
      setBusy(true);
      const key = `variants/${variantId}/${Date.now()}-${file.name}`;
      const presignRes = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key, contentType: file.type })
      });
      if (!presignRes.ok) throw new Error('Failed to presign');
      const presign = await presignRes.json();
      const requiredHeaders = presign.requiredHeaders as Record<string, string> | undefined;
      const putRes = await fetch(presign.url, {
        method: 'PUT',
        body: file,
        headers: requiredHeaders ?? { 'content-type': file.type }
      });
      if (!putRes.ok) throw new Error('Upload failed');

      const attachRes = await fetch(`/api/variants/${variantId}/media`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: presign.publicUrl, isPrimary: false })
      });
      if (!attachRes.ok) throw new Error('Attach media failed');

      // Refresh server-rendered data
  router.refresh();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert((err as Error).message || 'Upload error');
    } finally {
      // clear the input so same file could be re-selected if needed
      e.currentTarget.value = '';
  setBusy(false);
    }
  }

  return (
    <label className={className ?? 'text-blue-600 text-sm cursor-pointer'}>
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      {busy ? 'Uploading…' : 'Upload'}
    </label>
  );
}
