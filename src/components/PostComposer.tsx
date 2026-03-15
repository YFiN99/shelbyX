import { useState, useRef, ChangeEvent } from "react";
import { ImagePlus, FileText, Send, X, Loader2 } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAuth } from "../contexts/AuthContext";
import { useFeed } from "../contexts/FeedContext";
import { uploadToShelby } from "../lib/shelby";
import { Post } from "../types";

const MAX_CHARS = 280;

export default function PostComposer() {
  const { user }    = useAuth();
  const { addPost } = useFeed();
  const { account } = useWallet();

  const [content, setContent]     = useState("");
  const [file, setFile]           = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const remaining = MAX_CHARS - content.length;
  const canPost   = content.trim().length > 0 && remaining >= 0 && !uploading;

  async function handleSubmit() {
    if (!canPost || !user) return;
    setError("");
    setUploading(true);

    try {
      let mediaUrl: string | undefined;
      let blobName: string | undefined;
      let mediaType: Post["mediaType"];

      if (file && account) {
        const result = await uploadToShelby(file, account.address.toString());
        mediaUrl  = result.url;
        blobName  = result.blobName;
        mediaType = file.type.startsWith("image/") ? "image"
          : file.type.startsWith("video/") ? "video"
          : "pdf";
      }

      const post: Post = {
        id:         `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        author:     user.address,
        authorName: user.name,
        content:    content.trim(),
        mediaUrl,
        blobName,
        mediaType,
        timestamp:  Date.now(),
        likes:      [],
        reposts:    [],
        comments:   [],
      };

      addPost(post);
      setContent("");
      setFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload gagal";
      setError(msg);
    } finally {
      setUploading(false);
    }
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > 50 * 1024 * 1024) {
      setError("Max file size adalah 50 MB");
      return;
    }
    setFile(f);
    setError("");
  }

  return (
    <div className="card mb-4 animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-medium text-white ring-2 ring-brand-500/20">
          {user.name?.slice(0, 2).toUpperCase()}
        </div>
        <textarea
          className="input-field min-h-[80px] resize-none flex-1 text-base"
          placeholder="Cerita apa hari ini? #web3 #shelby"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MAX_CHARS + 20}
        />
      </div>

      {file && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          <FileText size={14} className="text-brand-400" />
          <span className="flex-1 truncate">{file.name}</span>
          <span className="text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
          <button onClick={() => setFile(null)} className="text-slate-500 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          <button onClick={() => fileRef.current?.click()}
            className="btn-ghost text-slate-400 hover:text-brand-400" title="Upload media">
            <ImagePlus size={18} />
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*,application/pdf"
            className="hidden" onChange={handleFile} />
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs tabular-nums ${
            remaining < 20 ? remaining < 0 ? "text-red-400" : "text-amber-400" : "text-slate-500"
          }`}>{remaining}</span>
          <button onClick={handleSubmit} disabled={!canPost} className="btn-primary">
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {uploading ? (file ? "Mengupload…" : "Memposting…") : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
