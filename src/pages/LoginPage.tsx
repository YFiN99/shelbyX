import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Shield, Globe, Database } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import WalletButton from "../components/WalletButton";

const features = [
  {
    icon: <Shield size={18} />,
    title: "Terdesentralisasi",
    desc: "Identitasmu = wallet Aptos. Tidak ada server pusat.",
  },
  {
    icon: <Database size={18} />,
    title: "Media di Shelby",
    desc: "Foto & file disimpan di jaringan Shelby, bukan cloud biasa.",
  },
  {
    icon: <Globe size={18} />,
    title: "Terbuka & Permanen",
    desc: "Post tersimpan on-chain. Tidak bisa dihapus sembarangan.",
  },
];

export default function LoginPage() {
  const { isConnected } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) navigate("/");
  }, [isConnected]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background orbs */}
      <div
        className="bg-orb opacity-20"
        style={{
          width: 600,
          height: 600,
          background: "#4f6ef7",
          top: -200,
          left: -200,
        }}
      />
      <div
        className="bg-orb opacity-10"
        style={{
          width: 400,
          height: 400,
          background: "#a855f7",
          bottom: -100,
          right: -100,
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-400">
            <Zap size={14} fill="currentColor" />
            Web3 Social Platform
          </div>
          <h1 className="font-display text-5xl text-white mb-3">ShelbyX</h1>
          <p className="text-slate-400 leading-relaxed">
            Sosial media berbasis blockchain Aptos.<br />
            Media tersimpan di Shelby Network. Bebas sensor.
          </p>
        </div>

        {/* Connect card */}
        <div className="card mb-6 text-center py-8">
          <p className="text-sm text-slate-400 mb-5">
            Hubungkan wallet Aptos untuk mulai
          </p>
          <WalletButton />
          <p className="mt-4 text-xs text-slate-600">
            Petra · Martian · Pontem · OKX · dan wallet Aptos lainnya
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.title} className="card flex items-start gap-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{f.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
