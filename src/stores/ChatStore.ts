// src/stores/chatStore.ts
import { create } from "zustand";
import { sendMessageToBackend } from "../services/tauriService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;

  // アクション
  addMessage: (text: string, isUser: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  setConnected: (connected: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  isConnected: false,

  addMessage: (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  sendMessage: async (text: string) => {
    if (!text.trim()) return;

    // ユーザーメッセージを追加
    get().addMessage(text, true);

    // ローディング開始
    set({ isLoading: true });

    try {
      // バックエンドに送信
      const response = await sendMessageToBackend(text);

      // 応答を追加
      get().addMessage(response, false);
    } catch (error) {
      console.error("送信エラー:", error);
      get().addMessage("エラーが発生しました", false);
    } finally {
      set({ isLoading: false });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },
}));
