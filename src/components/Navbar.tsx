import { Link, useLocation } from "react-router-dom";
import { Home, User, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import WalletButton from "./WalletButton";

export default function Navbar() {
  const { user, disconnect } = useAuth();
  const { pathname } = useLocation();

  function navLink(to: string, icon: React.ReactNode, label: string) {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          active
            ? "bg-brand-500/15 text-brand-400"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  }

  return (
    <header className="glass sticky top-0 z-50 flex items-center justify-between px-4 py-3 mb-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-display text-xl text-white">
        <Zap size={20} className="text-brand-400" fill="currentColor" />
        ShelbyX
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navLink("/", <Home size={16} />, "Feed")}
        {user && navLink(`/profile/${user.address}`, <User size={16} />, "Profil")}
      </nav>

      {/* Wallet */}
      <WalletButton />
    </header>
  );
}
