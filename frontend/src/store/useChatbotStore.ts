import { Chatbot } from '@/lib/types';
import { create } from 'zustand';

interface ChatbotState {
  chatbots: Chatbot[];
  isLoading: boolean;
  hasLoaded: boolean;
  // Actions
  setChatbots: (chatbots: Chatbot[]) => void;
  addChatbot: (chatbot: Chatbot) => void;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => void;
  deleteChatbot: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setHasLoaded: (loaded: boolean) => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  chatbots: [],
  isLoading: false,
  error: null,
  hasLoaded: false,
  setChatbots: (chatbots) =>
    set({ chatbots, hasLoaded: true, isLoading: false }),
  addChatbot: (chatbot) =>
    set((state) => ({
      chatbots: [...state.chatbots, chatbot],
    })),
  updateChatbot: (id, updates) =>
    set((state) => ({
      chatbots: state.chatbots.map((bot) =>
        bot.id === id ? { ...bot, ...updates } : bot
      ),
    })),
  deleteChatbot: (id) =>
    set((state) => ({
      chatbots: state.chatbots.filter((bot) => bot.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
}));
