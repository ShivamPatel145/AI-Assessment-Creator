import { create } from 'zustand';
import { apiFetch } from '@/lib/api';

interface Group {
  _id: string;
  title: string;
  students: number;
  term: string;
  color: string;
  createdAt: string;
}

interface GroupState {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  createGroup: (data: { title: string; students: number; term: string; color: string }) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

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
    } catch (err: any) {
      set({ groups: [], isLoading: false, error: err.message });
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
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteGroup: async (id) => {
    try {
      const res = await apiFetch(`/groups/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete group');
      await get().fetchGroups();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
