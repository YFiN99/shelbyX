import { useState } from "react";
import { Eye, EyeOff, Key, X, ShieldAlert } from "lucide-react";
import { accountFromPrivateKey } from "../lib/shelby";
import { Account } from "@aptos-labs/ts-sdk";

interface Props {
  onConfirm: (account: Account) => void;
  onCancel: () => void;
}

export default function PrivateKeyModal({ onConfirm, onCancel }: Props) {
  const [key, setKey]       = useState("");
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState("");

  function handleConfirm() {
    setError("");
    try {
      const account = accountFromPrivateKey(key.trim());
      onConfirm(account);
    } catch {
      setError("Private key tidak valid. Pastikan format hex benar (0x...).");
    }
  }

  return (
    // Faux backdrop — pakai min-height agar iframe tidak collapse
    <div style={{ minHeight: 420 }} className="flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-2 p-6 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
              <Key size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Private Key Diperlukan</p>
              <p className="text-xs text-slate-500">Untuk signing transaksi Shelby</p>
            </div>
          </div>
          <button onClick={onCancel} className="btn-ghost p-1.5">
            <X size={15} />
          </button>
        </div>

        {/* Warning */}
        <div className="mb-4 flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <ShieldAlert size={15} className="shrink-0 mt-0.5 text-amber-400" />
          <p className="text-xs text-amber-200 leading-relaxed">
            Private key <strong>tidak disimpan</strong> ke localStorage atau server.
            Hanya digunakan di memory untuk sesi upload ini saja.
            Pastikan kamu menggunakan akun testnet, bukan akun dengan aset nyata.
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Private Key Aptos (Shelbynet)
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="input-field pr-10 font-mono text-xs"
              placeholder="0xed25519-priv-..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          <p className="mt-1.5 text-xs text-slate-600">
            Dapatkan private key dari:{" "}
            <code className="text-slate-500">shelby account list</code> di CLI
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center">
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!key.trim()}
            className="btn-primary flex-1 justify-center"
          >
            Konfirmasi & Upload
          </button>
        </div>
      </div>
    </div>
  );
}
