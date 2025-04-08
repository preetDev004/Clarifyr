import { UserDocument } from '@/lib/types';
import { create } from 'zustand';

// Define the store's state and actions
interface DocumentState {
  documents: UserDocument[];
  isLoading: boolean;
  error: Error | null;
  hasLoaded: boolean;

  // Actions
  setDocuments: (documents: UserDocument[]) => void;
  addDocument: (document: UserDocument) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<UserDocument>) => void; // New method
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
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
}));
