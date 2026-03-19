import { create } from 'zustand';
import { apiFetch } from '@/lib/api';

interface LibraryFile {
  _id: string;
  name: string;
  type: string;
  folder: string;
  createdAt: string;
}

interface LibraryState {
  files: LibraryFile[];
  isLoading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
  addFile: (data: { name: string; type: string; folder: string }) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  files: [],
  isLoading: false,
  error: null,

  fetchFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch('/library');
      if (!res.ok) throw new Error('Failed to fetch library');
      const data = await res.json();
      set({ files: data, isLoading: false });
    } catch (err: any) {
      set({ files: [], isLoading: false, error: err.message });
    }
  },

  addFile: async (data) => {
    try {
      const res = await apiFetch('/library', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add file');
      await get().fetchFiles();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteFile: async (id) => {
    try {
      const res = await apiFetch(`/library/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete file');
      await get().fetchFiles();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
