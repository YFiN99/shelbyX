import { useParams } from "react-router-dom";
import { useFeed } from "../contexts/FeedContext";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";
import { Grid3x3, MessageCircle, Heart } from "lucide-react";

export default function ProfilePage() {
  const { address } = useParams<{ address: string }>();
  const { getPostsByAuthor } = useFeed();
  const { user, updateProfile } = useAuth();

  if (!address) return null;

  const posts = getPostsByAuthor(address);
  const isOwn = user?.address === address;
  const displayName = user?.name ?? `${address.slice(0, 6)}…${address.slice(-4)}`;

  const totalLikes = posts.reduce((acc, p) => acc + p.likes.length, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

  return (
    <div className="relative z-10">
      {/* Profile header */}
      <div className="card mb-4 animate-fade-up">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-2xl font-display text-white ring-4 ring-brand-500/20 shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {isOwn ? (
              <input
                className="input-field py-1 text-base font-medium mb-1 w-full max-w-xs"
                value={user?.name ?? ""}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Nama kamu"
              />
            ) : (
              <h1 className="text-lg font-medium text-white truncate">{displayName}</h1>
            )}
            <p className="text-xs text-slate-500 font-mono mb-2 truncate">{address}</p>
            {isOwn ? (
              <textarea
                className="input-field text-sm resize-none w-full"
                rows={2}
                value={user?.bio ?? ""}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                placeholder="Bio singkat..."
              />
            ) : (
              user?.bio && <p className="text-sm text-slate-400">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Post", value: posts.length, icon: <Grid3x3 size={14} /> },
            { label: "Like diterima", value: totalLikes, icon: <Heart size={14} /> },
            { label: "Komentar", value: totalComments, icon: <MessageCircle size={14} /> },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 p-3 text-center">
              <div className="flex justify-center text-brand-400 mb-1">{s.icon}</div>
              <p className="text-lg font-medium text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Grid3x3 size={14} className="text-brand-400" />
        <span className="text-sm font-medium">Post oleh akun ini</span>
      </div>

      {posts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-sm text-slate-400">Belum ada post.</p>
        </div>
      ) : (
        posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))
      )}
    </div>
  );
}
