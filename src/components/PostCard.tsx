import { useState } from "react";
import { Heart, Repeat2, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Post, Comment } from "../types";
import { useFeed } from "../contexts/FeedContext";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  post: Post;
  style?: React.CSSProperties;
}

function formatAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "baru saja";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}j`;
  return `${Math.floor(diff / 86_400_000)}h`;
}

export default function PostCard({ post, style }: Props) {
  const { user } = useAuth();
  const { likePost, unlikePost, repostPost, addComment } = useFeed();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = user ? post.likes.includes(user.address) : false;
  const isReposted = user ? post.reposts.includes(user.address) : false;

  function toggleLike() {
    if (!user) return;
    isLiked ? unlikePost(post.id, user.address) : likePost(post.id, user.address);
  }

  function handleRepost() {
    if (!user || isReposted) return;
    repostPost(post.id, user.address);
  }

  function submitComment() {
    if (!user || !commentText.trim()) return;
    const comment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: user.address,
      authorName: user.name,
      content: commentText.trim(),
      timestamp: Date.now(),
    };
    addComment(post.id, comment);
    setCommentText("");
  }

  return (
    <article
      className="card glass-hover mb-3 animate-fade-up"
      style={style}
    >
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-brand-500 flex items-center justify-center text-xs font-medium text-white ring-2 ring-white/10">
          {(post.authorName ?? post.author).slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {post.authorName ?? formatAddress(post.author)}
          </p>
          <p className="text-xs text-slate-500 font-mono">
            {formatAddress(post.author)} · {timeAgo(post.timestamp)}
          </p>
        </div>
        <span className="tag">on-chain</span>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-slate-200 mb-3 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Media */}
      {post.mediaUrl && post.mediaType === "image" && (
        <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
          <img
            src={post.mediaUrl}
            alt="post media"
            className="w-full max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      )}
      {post.mediaUrl && post.mediaType === "pdf" && (
        <a
          href={post.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-brand-400 hover:text-brand-300 transition"
        >
          📄 {post.blobName ?? "Dokumen PDF"}
        </a>
      )}

      {/* Action row */}
      <div className="flex items-center gap-1 pt-2 border-t border-white/5">
        {/* Like */}
        <button
          onClick={toggleLike}
          className={`btn-ghost gap-1.5 ${isLiked ? "text-red-400 hover:text-red-300" : ""}`}
        >
          <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
          <span className="text-xs tabular-nums">{post.likes.length || ""}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments((v) => !v)}
          className="btn-ghost gap-1.5"
        >
          <MessageCircle size={15} />
          <span className="text-xs tabular-nums">{post.comments.length || ""}</span>
          {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {/* Repost */}
        <button
          onClick={handleRepost}
          className={`btn-ghost gap-1.5 ${isReposted ? "text-green-400 hover:text-green-300" : ""}`}
          title={isReposted ? "Sudah direpost" : "Repost"}
        >
          <Repeat2 size={15} />
          <span className="text-xs tabular-nums">{post.reposts.length || ""}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
          {post.comments.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-2">
              Belum ada komentar. Jadilah yang pertama!
            </p>
          )}
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-[10px] font-medium text-white">
                {(c.authorName ?? c.author).slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 rounded-xl bg-white/5 px-3 py-2">
                <p className="text-xs font-medium text-slate-300 mb-0.5">
                  {c.authorName ?? formatAddress(c.author)}
                  <span className="ml-2 text-slate-600 font-normal">{timeAgo(c.timestamp)}</span>
                </p>
                <p className="text-sm text-slate-200">{c.content}</p>
              </div>
            </div>
          ))}

          {user && (
            <div className="flex gap-2 pt-1">
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-[10px] font-medium text-white">
                {user.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  className="input-field py-1.5 text-sm flex-1"
                  placeholder="Tulis komentar…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment()}
                />
                <button
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                  className="btn-primary px-3 py-1.5"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
