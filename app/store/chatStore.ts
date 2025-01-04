import { create } from 'zustand';
import { SessionChatMessage } from 'teleparty-websocket-lib';

interface User {
  nickname: string;
}

interface ChatStore {
  userId: string | null;
  messages: SessionChatMessage[];
  isConnected: boolean;
  roomId: string | null;
  user: User | null;
  usersTyping: string[];
  addMessage: (message: SessionChatMessage) => void;
  setIsConnected: (isConnected: boolean) => void;
  setRoomId: (roomId: string | null) => void;
  setUser: (user: User | null) => void;
  setTypingUsers: (users: string[]) => void;
  setUserId: (userId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  userId: null,
  messages: [],
  isConnected: false,
  roomId: null,
  user: null,
  usersTyping: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsConnected: (isConnected) => set({ isConnected }),
  setRoomId: (roomId) => set({ roomId }),
  setUser: (user) => set({ user }),
  setTypingUsers: (users) => set({ usersTyping: users }),
  setUserId: (userId) => set({ userId }),
}));
