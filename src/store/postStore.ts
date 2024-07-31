import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Descendant } from "slate";

type Post = {
  id: string;
  content: any;
  downloadUrl?: string | null;
};

type PostStore = {
  posts: Post[];
  addPost: (content: string, id?: string) => string;
  updatePost: (id: string, content: string) => void;
  getPost: (id: string) => Post | undefined;
  clearPosts: () => void;
  setDownloadUrl: (id: string, url: string | null) => void;
};

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  addPost: (content, id) => {
    const postId = id || uuidv4();
    set((state) => ({ posts: [...state.posts, { id: postId, content }] }));
    return postId;
  },
  updatePost: (id, content) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, content } : post,
      ),
    })),
  getPost: (id) => get().posts.find((post) => post.id === id),
  clearPosts: () => set({ posts: [] }),
  setDownloadUrl: (id, url) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, downloadUrl: url } : post,
      ),
    })),
}));
