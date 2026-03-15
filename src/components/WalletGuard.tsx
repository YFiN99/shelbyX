import { ReactNode } from "react";
import { Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import WalletButton from "./WalletButton";

interface Props {
  children: ReactNode;
  message?: string;
}

export default function WalletGuard({ children, message }: Props) {
  const { isConnected } = useAuth();

  if (isConnected) return <>{children}</>;

  return (
    <div className="card flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15">
        <Zap size={22} className="text-brand-400" fill="currentColor" />
      </div>
      <div>
        <p className="text-sm font-medium text-white mb-1">Wallet Belum Terhubung</p>
        <p className="text-xs text-slate-500">
          {message ?? "Hubungkan wallet Aptos untuk menggunakan fitur ini."}
        </p>
      </div>
      <WalletButton />
    </div>
  );
}
