# ShelbyX — Web3 Social Platform

Satu proyek, satu deploy. Frontend React + Serverless API — semuanya di Vercel.

---

## 🚀 Deploy ke Vercel (Cara Tercepat)

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "init shelbyx"
git remote add origin https://github.com/username/shelbyx.git
git push -u origin main
```

### 2. Import ke Vercel
1. Buka [vercel.com](https://vercel.com) → **Add New Project**
2. Import repo GitHub kamu
3. Framework: **Vite** (auto-detect)
4. Klik **Environment Variables** → tambahkan:

| Key | Value |
|-----|-------|
| `SHELBY_ACCOUNT_PRIVATE_KEY` | `ed25519-priv-0x...` (dari `shelby account list`) |
| `SHELBY_API_KEY` | `aptoslabs_...` (dari geomi.dev, gunakan server key) |
| `SHELBY_BASE_URL` | `https://api.testnet.shelby.xyz/shelby/v1/blobs` |
| `VITE_SHELBY_BASE_URL` | `https://api.testnet.shelby.xyz/shelby/v1/blobs` |

5. Klik **Deploy** → selesai! ✅

---

## 💻 Dev Lokal

Butuh [Vercel CLI](https://vercel.com/docs/cli) agar `/api` berjalan lokal:

```bash
npm install -g vercel
npm install
cp .env.example .env.local   # isi environment variables
vercel dev                    # jalankan frontend + api sekaligus di localhost:3000
```

---

## 🗂️ Struktur Proyek

```
shelbyx/
├── api/
│   ├── upload.js     ← Vercel Serverless Function (upload ke Shelby)
│   └── health.js     ← Health check
├── src/              ← React frontend
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/shelby.ts ← Panggil /api/upload
│   └── pages/
├── vercel.json       ← Routing config
├── vite.config.ts    ← Proxy /api saat dev
└── package.json
```

---

## ⚙️ Cara Kerja Upload

```
User upload file
  → Frontend POST /api/upload (FormData)
  → Vercel Serverless Function
  → ShelbyNodeClient.upload() dengan private key app
  → Return { url, blobName, txHash }
  → Frontend tampilkan media di post
```

User **tidak perlu private key** — cukup connect wallet Aptos untuk identitas.

---

## 📋 Cara Dapat Akun Shelby untuk Server

```bash
npm i -g @shelby-protocol/cli
shelby init          # buat akun baru
shelby account list  # salin Private Key → taruh di Vercel env
shelby faucet        # isi APT + ShelbyUSD gratis (testnet)
```
