'use server';

import { db } from '@/db';
import { campaigns, leads } from '@/db/schema';
import { auth } from '@/lib/auth';
import { and, count, desc, eq } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import type { CampaignWithStats } from '@/lib/types';

// Get dashboard data including recent leads and campaigns
export async function getDashboardData() {
  noStore();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Get recent leads (last 10)
  const recentLeads = await db
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
      campaign: campaigns.name,
      createdAt: leads.createdAt,
    })
    .from(leads)
    .leftJoin(campaigns, eq(campaigns.id, leads.campaignId))
    .where(eq(leads.userId, session.user.id))
    .orderBy(desc(leads.createdAt))
    .limit(10);

  // Get campaigns with stats (same logic as campaigns page)
  const userCampaigns = await db.select().from(campaigns).where(eq(campaigns.userId, session.user.id));

  const campaignsWithStats = await Promise.all(
    userCampaigns.map(async (campaign: any) => {
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

  return {
    recentLeads,
    campaigns: campaignsWithStats as CampaignWithStats[],
  };
}

// Get LinkedIn accounts data (dummy data for now)
export async function getLinkedInAccounts() {
  noStore();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  // Return dummy LinkedIn accounts data
  return [
    {
      id: '1',
      name: 'Pulkit Garg',
      email: '1999pulkitgarg@gmail.com',
      status: 'Connected',
      requests: 17,
      maxRequests: 30,
    },
    {
      id: '2',
      name: 'Jivesh Lakhani',
      email: 'ljivesh@gmail.com',
      status: 'Connected',
      requests: 19,
      maxRequests: 30,
    },
    {
      id: '3',
      name: 'Indrajit Sahani',
      email: 'indrajit38mig@gmail.com',
      status: 'Connected',
      requests: 18,
      maxRequests: 30,
    },
    {
      id: '4',
      name: 'Bhavya Arora',
      email: 'bhavyaarora199.ba@gmail.com',
      status: 'Connected',
      requests: 18,
      maxRequests: 100,
    },
  ];
}
