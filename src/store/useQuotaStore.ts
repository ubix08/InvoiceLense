import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Tier = 'free' | 'starter' | 'pro';

interface QuotaStore {
  tier:          Tier;
  docsUsed:      number;   
  pagesUsed:     number;   
  pagesAllowed:  number;   
  periodStart:   string;   

  consumePage:   () => boolean;   
  upgradeTo:     (tier: Tier) => void;
  resetPeriod:   () => void;
}

export const useQuotaStore = create<QuotaStore>()(
  persist(
    (set, get) => ({
      tier:         'free',
      docsUsed:     0,
      pagesUsed:    0,
      pagesAllowed: 5,
      periodStart:  new Date().toISOString(),

      consumePage: () => {
        const { tier, docsUsed, pagesUsed, pagesAllowed } = get();
        if (tier === 'free') {
          if (docsUsed >= 5) return false;
          set({ docsUsed: docsUsed + 1 });
          return true;
        }
        if (pagesUsed >= pagesAllowed && tier !== 'pro') return false;
        set({ pagesUsed: pagesUsed + 1 });
        return true;
      },

      upgradeTo: (tier) => {
        const limits: Record<Tier, number> = { free: 5, starter: 500, pro: Infinity };
        set({
          tier,
          pagesAllowed: limits[tier],
          pagesUsed: 0,
          periodStart: new Date().toISOString(),
        });
      },

      resetPeriod: () => set({ pagesUsed: 0, periodStart: new Date().toISOString() }),
    }),
    { name: 'invoicelens-quota' }
  )
);
