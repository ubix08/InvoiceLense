import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  webhookUrl: string;
  webhookSecret: string;
  sheetsUrl: string;
  setWebhookUrl: (url: string) => void;
  setWebhookSecret: (secret: string) => void;
  setSheetsUrl: (url: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      webhookUrl: '',
      webhookSecret: '',
      sheetsUrl: '',
      setWebhookUrl: (url) => set({ webhookUrl: url }),
      setWebhookSecret: (secret) => set({ webhookSecret: secret }),
      setSheetsUrl: (url) => set({ sheetsUrl: url }),
    }),
    { name: 'invoicelens-settings' }
  )
);
