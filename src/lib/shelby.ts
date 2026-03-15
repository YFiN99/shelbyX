/**
 * Upload file ke Shelby via /api/upload.
 * - Dev: http://localhost:3000/api/upload  (Vercel CLI)
 * - Prod: https://shelbyx.vercel.app/api/upload  (otomatis)
 * Tidak perlu VITE_BACKEND_URL — /api selalu relatif ke domain yang sama.
 */
export async function uploadToShelby(
  file: File,
  walletAddress: string
): Promise<{ blobName: string; url: string; txHash: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("walletAddress", walletAddress);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload gagal" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  return res.json();
}

export function shelbyBlobUrl(ownerAddress: string, blobName: string): string {
  const base =
    import.meta.env.VITE_SHELBY_BASE_URL ??
    "https://api.testnet.shelby.xyz/shelby/v1/blobs";
  return `${base}/${ownerAddress}/${encodeURIComponent(blobName)}`;
}
