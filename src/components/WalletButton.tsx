import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, X, ChevronDown } from "lucide-react";

export default function WalletButton() {
  const { wallets = [], connect, connected, disconnect, account } = useWallet();
  const [open, setOpen] = useState(false);

  if (connected && account) {
    const addr = account.address.toString();
    return (
      <div className="flex items-center gap-2">
        <span className="hidden md:block text-xs text-slate-500 font-mono">
          {addr.slice(0, 6)}…{addr.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="btn-ghost text-xs gap-1.5"
          title="Disconnect wallet"
        >
          <X size={14} />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-primary gap-2 text-sm"
      >
        <Wallet size={15} />
        Connect Wallet
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[200px] rounded-2xl border border-white/10 bg-surface-2 p-2 shadow-xl shadow-black/40">
            <p className="px-3 py-1.5 text-xs text-slate-500 font-medium">
              Pilih wallet
            </p>
            {wallets.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400">
                Tidak ada wallet terdeteksi.{" "}
                <a
                  href="https://petra.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 underline underline-offset-2"
                >
                  Install Petra ↗
                </a>
              </p>
            )}
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => {
                  connect(wallet.name);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white transition hover:bg-white/5"
              >
                {wallet.icon && (
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-6 w-6 rounded-lg"
                  />
                )}
                {wallet.name}
                {!wallet.readyState || wallet.readyState === "NotDetected" ? (
                  <span className="ml-auto text-xs text-slate-600">Tidak terinstall</span>
                ) : (
                  <span className="ml-auto text-xs text-green-500">Terdeteksi</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
