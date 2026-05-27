import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentJob } from '../core/ocr/ocrTypes';

interface DocumentStore {
  jobs: DocumentJob[];
  activeJobId: string | null;

  addJob:        (job: DocumentJob) => void;
  updateJob:     (id: string, updates: Partial<DocumentJob>) => void;
  removeJob:     (id: string) => void;
  clearAll:      () => void;
  setActiveJob:  (id: string | null) => void;
  getJob:        (id: string) => DocumentJob | undefined;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      jobs:        [],
      activeJobId: null,

      addJob:    (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
      updateJob: (id, updates) => set((s) => ({
        jobs: s.jobs.map(j => j.id === id ? { ...j, ...updates } : j),
      })),
      removeJob: (id) => set((s) => ({ jobs: s.jobs.filter(j => j.id !== id) })),
      clearAll:  () => set({ jobs: [], activeJobId: null }),
      setActiveJob: (id) => set({ activeJobId: id }),
      getJob: (id) => get().jobs.find(j => j.id === id),
    }),
    {
      name: 'invoicelens-documents',
      partialize: (state) => ({
        jobs: state.jobs
          .filter(j => j.stage === 'done')
          .slice(0, 50),
      }),
    }
  )
);
