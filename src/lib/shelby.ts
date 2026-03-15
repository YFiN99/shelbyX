/// <reference types="vite/client" />

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
  const base = import.meta.env.VITE_SHELBY_BASE_URL
    ?? "https://api.testnet.shelby.xyz/shelby/v1/blobs";
  return `${base}/${ownerAddress}/${encodeURIComponent(blobName)}`;
}
