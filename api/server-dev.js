import express from "express";
import multer from "multer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dir, "../.env.local") });
config({ path: resolve(__dir, "../.env") });

const { Account, Ed25519PrivateKey, Network } = await import("@aptos-labs/ts-sdk");
const { ShelbyNodeClient } = await import("@shelby-protocol/sdk/node");

const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

let _client = null;
function getClient() {
  if (_client) return _client;
  const apiKey = process.env.SHELBY_API_KEY;
  if (!apiKey) throw new Error("SHELBY_API_KEY tidak di-set di .env");
  _client = new ShelbyNodeClient({ network: Network.TESTNET, apiKey });
  return _client;
}

function getSigner() {
  const raw = process.env.SHELBY_ACCOUNT_PRIVATE_KEY;
  if (!raw) throw new Error("SHELBY_ACCOUNT_PRIVATE_KEY tidak di-set di .env");
  const hex = raw.trim().replace("ed25519-priv-", "");
  return Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(hex) });
}

app.options("*", (_, res) => res.status(200).end());

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File tidak ditemukan" });
    const walletAddress    = req.body.walletAddress ?? "unknown";
    const signer           = getSigner();
    const blobData         = new Uint8Array(req.file.buffer);
    const blobName         = `${walletAddress}/${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const expirationMicros = Date.now() * 1000 + 24 * 60 * 60 * 1_000_000;

    const { transaction } = await getClient().upload({ signer, blobData, blobName, expirationMicros });

    const base = process.env.SHELBY_BASE_URL ?? "https://api.testnet.shelby.xyz/shelby/v1/blobs";
    const url  = `${base}/${signer.accountAddress.toString()}/${encodeURIComponent(blobName)}`;
    res.json({ blobName, url, txHash: transaction.hash });
  } catch (err) {
    console.error("[upload]", err?.message);
    res.status(500).json({ error: err?.message ?? "Upload gagal" });
  }
});

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.listen(3000, () => console.log("✅  API dev server → http://localhost:3000"));
