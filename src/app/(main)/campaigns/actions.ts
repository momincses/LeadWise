// app/(main)/campaigns/actions.ts
'use server';

import { db } from '@/db';
import { campaigns, leads } from '@/db/schema';
import { auth } from '@/lib/auth';
import type { CampaignWithStats } from '@/lib/types';
import { and, count, eq } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function getCampaignsForUser(): Promise<CampaignWithStats[]> {
  noStore();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const userCampaigns = await db.select().from(campaigns).where(eq(campaigns.userId, session.user.id));

  // For each campaign, calculate its stats
  const campaignsWithStats = await Promise.all(
    userCampaigns.map(async (campaign: any) => {
      // These queries can be optimized, e.g., with a single grouped query
      const totalLeads = await db.select({ value: count() }).from(leads).where(eq(leads.campaignId, campaign.id));
      const accepted = await db.select({ value: count() }).from(leads).where(and(eq(leads.campaignId, campaign.id), eq(leads.status, 'ACCEPTED')));
      const pending = await db.select({ value: count() }).from(leads).where(and(eq(leads.campaignId, campaign.id), eq(leads.status, 'PENDING')));
      const messaged = await db.select({ value: count() }).from(leads).where(and(eq(leads.campaignId, campaign.id), eq(leads.status, 'MESSAGED')));

      return {
        ...campaign,
        stats: {
          totalLeads: totalLeads[0]?.value ?? 0,
          requests: {
            accepted: accepted[0]?.value ?? 0,
            pending: pending[0]?.value ?? 0,
            rejected: 0, // Placeholder
          },
          connections: {
            messaged: messaged[0]?.value ?? 0,
          },
        },
      };
    })
  );

  return campaignsWithStats;
}

// ✅ NEW: Function to create a campaign
export async function createCampaign(name: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    return { success: false, message: 'Not authenticated' };
  }

  if (!name || name.trim().length === 0) {
    return { success: false, message: 'Campaign name cannot be empty.' };
  }

  try {
    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        name: name.trim(),
        userId: session.user.id,
      })
      .returning();

    // Revalidate the campaigns page to show the new campaign immediately
    revalidatePath('/campaigns');

    return { success: true, campaign: newCampaign };
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return { success: false, message: 'Could not create campaign.' };
  }
}
  

// Alias for compatibility with existing components
export const getCampaigns = getCampaignsForUser;