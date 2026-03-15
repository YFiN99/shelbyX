import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: (walletName: string) => void;
  disconnect: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { account, connected, connect, disconnect } = useWallet();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading] = useState(false);

  useEffect(() => {
    if (connected && account?.address) {
      const address = account.address.toString();
      const stored = localStorage.getItem(`profile:${address}`);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        const profile: UserProfile = {
          address,
          name: `${address.slice(0, 6)}…${address.slice(-4)}`,
          bio: "",
          followers: [],
          following: [],
        };
        setUser(profile);
        localStorage.setItem(`profile:${address}`, JSON.stringify(profile));
      }
    } else {
      setUser(null);
    }
  }, [connected, account]);

  function updateProfile(patch: Partial<UserProfile>) {
    if (!user) return;
    const updated = { ...user, ...patch };
    setUser(updated);
    localStorage.setItem(`profile:${user.address}`, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{
      user,
      isConnected: connected,
      isLoading,
      connect,
      disconnect,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
