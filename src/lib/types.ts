// lib/types.ts

import type { campaigns, leadEvents, leads } from '@/db/schema';

// The base campaign type inferred from your Drizzle schema
export type Campaign = typeof campaigns.$inferSelect;

// A combined type for the campaign list, including calculated stats
export type CampaignWithStats = Campaign & {
  stats: {
    totalLeads: number;
    requests: {
      accepted: number;
      pending: number;
      rejected: number;
    };
    connections: {
      messaged: number;
    };
  };
};

// --- Lead Types (NEW) ---
export type Lead = typeof leads.$inferSelect;
export type LeadEvent = typeof leadEvents.$inferSelect;

// ✅ NEW: Type for the detailed lead data used in the side drawer
export type LeadWithDetails = Lead & {
  campaign: {
    name: string;
  };
  events: LeadEvent[];
};