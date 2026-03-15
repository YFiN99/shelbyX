export interface Post {
  id: string;
  author: string;          // Aptos wallet address
  authorName?: string;
  content: string;
  mediaUrl?: string;       // Shelby blob URL
  mediaType?: "image" | "video" | "pdf";
  blobName?: string;
  timestamp: number;       // Unix ms
  likes: string[];         // wallet addresses
  reposts: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  authorName?: string;
  content: string;
  timestamp: number;
}

export interface UserProfile {
  address: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  followers: string[];
  following: string[];
}
