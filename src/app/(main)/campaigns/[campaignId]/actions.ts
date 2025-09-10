// app/(main)/campaigns/[campaignId]/actions.ts
'use server';

import { db } from '@/db';
import { campaigns, leads } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';

export async function getCampaignById(campaignId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error('Not authenticated');

  const campaign = await db.select().from(campaigns).where(
    and(eq(campaigns.id, campaignId), eq(campaigns.userId, session.user.id))
  ).limit(1);

  return campaign[0] || null;
}

// Get leads for a specific campaign
export async function getCampaignLeads(campaignId: string) {
  noStore();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error('Not authenticated');

  // Verify the campaign belongs to the user
  const campaign = await db.select().from(campaigns).where(
    and(eq(campaigns.id, campaignId), eq(campaigns.userId, session.user.id))
  ).limit(1);

  if (!campaign[0]) {
    throw new Error('Campaign not found or access denied');
  }

  // Get leads for this campaign
  const campaignLeads = await db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      company: leads.company,
      position: leads.position,
      status: leads.status,
      stageConnectionRequested: leads.stageConnectionRequested,
      stageFirstFollowupSent: leads.stageFirstFollowupSent,
      stageSecondFollowupSent: leads.stageSecondFollowupSent,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .where(eq(leads.campaignId, campaignId))
    .orderBy(desc(leads.createdAt));

  return campaignLeads;
}

export async function updateCampaignSettings(campaignId: string, data: { name: string; isActive: boolean }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error('Not authenticated');
  
  await db.update(campaigns)
    .set({ name: data.name, isActive: data.isActive, updatedAt: new Date() })
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, session.user.id)));

  revalidatePath(`/campaigns/${campaignId}`);
}

export async function updateCampaignSequence(campaignId: string, data: { /* sequence fields */ }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error('Not authenticated');

  await db.update(campaigns)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, session.user.id)));
    
  revalidatePath(`/campaigns/${campaignId}`);
}