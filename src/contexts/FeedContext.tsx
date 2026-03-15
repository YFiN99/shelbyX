import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Post, Comment } from "../types";

interface FeedContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  likePost: (postId: string, address: string) => void;
  unlikePost: (postId: string, address: string) => void;
  repostPost: (postId: string, address: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  getPostsByAuthor: (address: string) => Post[];
}

const FeedContext = createContext<FeedContextType | null>(null);
const STORAGE_KEY = "shelbyx:posts";

function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(loadPosts);

  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const likePost = useCallback((postId: string, address: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId && !p.likes.includes(address)
          ? { ...p, likes: [...p.likes, address] }
          : p
      )
    );
  }, []);

  const unlikePost = useCallback((postId: string, address: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes.filter((a) => a !== address) }
          : p
      )
    );
  }, []);

  const repostPost = useCallback((postId: string, address: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId && !p.reposts.includes(address)
          ? { ...p, reposts: [...p.reposts, address] }
          : p
      )
    );
  }, []);

  const addComment = useCallback((postId: string, comment: Comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
  }, []);

  const getPostsByAuthor = useCallback(
    (address: string) => posts.filter((p) => p.author === address),
    [posts]
  );

  return (
    <FeedContext.Provider
      value={{
        posts,
        addPost,
        likePost,
        unlikePost,
        repostPost,
        addComment,
        getPostsByAuthor,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be inside FeedProvider");
  return ctx;
}
