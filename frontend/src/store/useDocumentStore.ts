import { UserDocument } from '@/lib/types';
import { create } from 'zustand';

// Define the store's state and actions
interface DocumentState {
  documents: UserDocument[];
  isLoading: boolean;
  error: Error | null;

  // Actions
  setDocuments: (documents: UserDocument[]) => void;
  addDocument: (document: UserDocument) => void;
  deleteDocument: (id: string) => void;

  // Flag to track if docs have been loaded
  hasLoaded: boolean;
  setHasLoaded: (loaded: boolean) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  setDocuments: (documents) => set({ documents, hasLoaded: true }),
  addDocument: (document) =>
    set((state) => ({
      documents: [...state.documents, document],
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
}));
