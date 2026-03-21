import { create } from 'zustand';
import { apiFetch } from '@/lib/api';

interface Group {
  _id: string;
  title: string;
  students: number;
  term: string;
  color: string;
  roster?: Array<{ name: string; rollNo?: string }>;
  createdAt: string;
}

interface GroupState {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  createGroup: (data: { title: string; students: number; term: string; color: string; roster?: Array<{ name: string; rollNo?: string }> }) => Promise<void>;
  updateGroup: (id: string, data: { title?: string; students?: number; term?: string; color?: string; roster?: Array<{ name: string; rollNo?: string }> }) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  clearError: () => void;
}

const toErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch('/groups');
      if (!res.ok) throw new Error('Failed to fetch groups');
      const data = await res.json();
      set({ groups: data, isLoading: false });
    } catch (error: unknown) {
      set({ groups: [], isLoading: false, error: toErrorMessage(error, 'Failed to fetch groups') });
    }
  },

  createGroup: async (data) => {
    try {
      const res = await apiFetch('/groups', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create group');
      await get().fetchGroups();
    } catch (error: unknown) {
      set({ error: toErrorMessage(error, 'Failed to create group') });
    }
  },

  updateGroup: async (id, data) => {
    try {
      const res = await apiFetch(`/groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update group');
      await get().fetchGroups();
    } catch (error: unknown) {
      set({ error: toErrorMessage(error, 'Failed to update group') });
    }
  },

  deleteGroup: async (id) => {
    try {
      const res = await apiFetch(`/groups/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete group');
      await get().fetchGroups();
    } catch (error: unknown) {
      set({ error: toErrorMessage(error, 'Failed to delete group') });
    }
  },

  clearError: () => set({ error: null }),
}));
