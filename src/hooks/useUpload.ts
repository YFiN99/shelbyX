import { useState, useCallback } from "react";
import { uploadToShelby } from "../lib/shelby";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "done"; url: string; blobName: string }
  | { status: "error"; message: string };

export function useUpload() {
  const { account } = useWallet();
  const [state, setState] = useState<UploadState>({ status: "idle" });

  const upload = useCallback(
    async (file: File): Promise<{ url: string; blobName: string } | null> => {
      if (!account) {
        setState({ status: "error", message: "Wallet belum terhubung" });
        return null;
      }

      setState({ status: "uploading", progress: 0 });

      try {
        // Simulate progress (Shelby SDK doesn't expose progress events yet)
        const progressInterval = setInterval(() => {
          setState((prev) =>
            prev.status === "uploading" && prev.progress < 85
              ? { status: "uploading", progress: prev.progress + 15 }
              : prev
          );
        }, 300);

        const result = await uploadToShelby(file, account as any);

        clearInterval(progressInterval);
        setState({ status: "done", ...result });
        return result;
      } catch (err: any) {
        setState({ status: "error", message: err?.message ?? "Upload gagal" });
        return null;
      }
    },
    [account]
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, upload, reset };
}
