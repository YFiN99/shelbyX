import { useFeed } from "../contexts/FeedContext";
import { useAuth } from "../contexts/AuthContext";
import { Post } from "../types";

/**
 * Convenience hook: returns feed helpers pre-bound to the current user.
 */
export function usePosts() {
  const { user } = useAuth();
  const { posts, likePost, unlikePost, repostPost, addComment } = useFeed();

  function toggleLike(postId: string) {
    if (!user) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    post.likes.includes(user.address)
      ? unlikePost(postId, user.address)
      : likePost(postId, user.address);
  }

  function handleRepost(postId: string) {
    if (!user) return;
    repostPost(postId, user.address);
  }

  function isLiked(post: Post) {
    return user ? post.likes.includes(user.address) : false;
  }

  function isReposted(post: Post) {
    return user ? post.reposts.includes(user.address) : false;
  }

  return { toggleLike, handleRepost, isLiked, isReposted };
}
