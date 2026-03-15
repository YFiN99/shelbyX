import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { UploadState } from "../hooks/useUpload";

interface Props {
  state: UploadState;
}

export default function UploadProgress({ state }: Props) {
  if (state.status === "idle") return null;

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      {state.status === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Loader2 size={14} className="animate-spin text-brand-400" />
            <span>Mengunggah ke Shelby Network…</span>
            <span className="ml-auto text-xs text-slate-500 tabular-nums">
              {state.progress}%
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      )}

      {state.status === "done" && (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle2 size={14} />
          <span>Upload berhasil!</span>
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2"
          >
            Lihat file ↗
          </a>
        </div>
      )}

      {state.status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle size={14} />
          <span>{state.message}</span>
        </div>
      )}
    </div>
  );
}
