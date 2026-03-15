import { useAuth } from "../contexts/AuthContext";
import { useFeed } from "../contexts/FeedContext";
import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";
import { Flame } from "lucide-react";

export default function FeedPage() {
  const { user } = useAuth();
  const { posts } = useFeed();

  return (
    <div className="relative">
      {/* BG orb */}
      <div
        className="bg-orb opacity-10"
        style={{
          width: 500,
          height: 500,
          background: "#4f6ef7",
          top: -150,
          right: -200,
        }}
      />

      <div className="relative z-10">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-2 text-slate-400">
          <Flame size={16} className="text-brand-400" />
          <span className="text-sm font-medium">Feed Terbaru</span>
          <span className="ml-auto text-xs text-slate-600">{posts.length} post</span>
        </div>

        {/* Composer — only if logged in */}
        {user && <PostComposer />}

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-2xl mb-2">🌐</p>
            <p className="text-sm text-slate-400">
              Belum ada post. Jadilah yang pertama!
            </p>
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
    </div>
  );
}
