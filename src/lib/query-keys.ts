// lib/query-keys.ts

export const queryKeys = {
  campaigns: {
    lists: () => ['campaigns', 'list'] as const,
    detail: (id: string) => ['campaigns', 'detail', id] as const,
  },
  leads: {
    all: ['leads'] as const,
    lists: () => [...queryKeys.leads.all, 'list'] as const,
    // ✅ Specific key for the infinite query list
    infiniteList: () => [...queryKeys.leads.lists(), 'infinite'] as const,
    details: () => [...queryKeys.leads.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.leads.details(), id] as const,
  },
} as const;

