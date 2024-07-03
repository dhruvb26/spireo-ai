import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

type Post = {
  id: string;
  content: string;
};

type PostStore = {
  posts: Post[];
  addPost: (content: string, id?: string) => string;
  updatePost: (id: string, content: string) => void;
  getPost: (id: string) => Post | undefined;
  clearPosts: () => void;
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
}));
