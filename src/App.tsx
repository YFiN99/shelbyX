import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { FeedProvider } from "./contexts/FeedContext";
import Navbar from "./components/Navbar";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAuth();
  return isConnected ? <>{children}</> : <Navigate to="/login" replace />;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-xl px-4 pb-12">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{ network: Network.TESTNET }}
      optInWallets={["Petra", "Pontem Wallet", "Martian Wallet", "OKX Wallet"]}
      onError={console.error}
    >
      <AuthProvider>
        <FeedProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <Layout>
                    <FeedPage />
                  </Layout>
                }
              />
              <Route
                path="/profile/:address"
                element={
                  <RequireAuth>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </FeedProvider>
      </AuthProvider>
    </AptosWalletAdapterProvider>
  );
}
