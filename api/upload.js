import { Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";

export const config = { api: { bodyParser: false } };

let _client = null;
function getClient() {
  if (_client) return _client;
  const apiKey = process.env.SHELBY_API_KEY;
  if (!apiKey) throw new Error("SHELBY_API_KEY tidak di-set");
  _client = new ShelbyNodeClient({
    network: Network.TESTNET,
    apiKey,
  });
  return _client;
}

function getSigner() {
  const raw = process.env.SHELBY_ACCOUNT_PRIVATE_KEY;
  if (!raw) throw new Error("SHELBY_ACCOUNT_PRIVATE_KEY tidak di-set");
  const hex = raw.trim().replace("ed25519-priv-", "");
  return Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(hex) });
}

async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let walletAddress = "";
    let fileName = "upload";

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1]?.trim();
        if (!boundary) return reject(new Error("No boundary"));

        const parts = body.toString("binary").split(`--${boundary}`)
          .filter((p) => p.includes("Content-Disposition"));

        let fileBuffer = null;
        for (const part of parts) {
          const [headers, ...rest] = part.split("\r\n\r\n");
          const content = rest.join("\r\n\r\n").replace(/\r\n$/, "");
          if (headers.includes('name="walletAddress"')) {
            walletAddress = content.trim();
          } else if (headers.includes('name="file"')) {
            const fn = headers.match(/filename="([^"]+)"/);
            if (fn) fileName = fn[1];
            fileBuffer = Buffer.from(content, "binary");
          }
        }
        if (!fileBuffer) return reject(new Error("File tidak ditemukan"));
        resolve({ fileBuffer, walletAddress, fileName });
      } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { fileBuffer, walletAddress, fileName } = await parseMultipart(req);
    if (fileBuffer.length > 50 * 1024 * 1024)
      return res.status(400).json({ error: "File terlalu besar. Max 50 MB." });

    const signer = getSigner();
    const blobData = new Uint8Array(fileBuffer);
    const blobName = `${walletAddress}/${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
    const expirationMicros = Date.now() * 1000 + 24 * 60 * 60 * 1_000_000;

    const { transaction } = await getClient().upload({ signer, blobData, blobName, expirationMicros });

    const base = process.env.SHELBY_BASE_URL ?? "https://api.testnet.shelby.xyz/shelby/v1/blobs";
    const url = `${base}/${signer.accountAddress.toString()}/${encodeURIComponent(blobName)}`;

    return res.status(200).json({ blobName, url, txHash: transaction.hash });
  } catch (err) {
    console.error("[upload]", err?.message);
    return res.status(500).json({ error: err?.message ?? "Upload gagal" });
  }
}
