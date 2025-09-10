'use server';

import { db } from '@/db';
import { campaigns, leads, leadEvents } from '@/db/schema';
import { auth } from '@/lib/auth';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Action for infinite scroll
export async function getLeads({ page = 0, limit = 15 }: { page: number; limit: number; }) {
  noStore();
  // FIX 1: getSession() requires the headers object.
  const session = await auth.api.getSession({ headers: await headers() });
  // FIX 2: The user's ID is on `session.user.id`, not `session.userId`.
  if (!session?.user?.id) throw new Error('Not authenticated');

  // Use explicit SELECT with LEFT JOIN to avoid lateral JSON join
  const rows = await db
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
    .limit(limit)
    .offset(page * limit);

  return rows;
}

// Action to get all details for one lead for the side drawer
export async function getLeadDetails(leadId: string) {
  noStore();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Not authenticated');

  // Fetch the lead core info with campaign name
  const [leadRow] = await db
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
      campaignName: campaigns.name,
      campaignId: leads.campaignId,
      createdAt: leads.createdAt,
      userId: leads.userId,
    })
    .from(leads)
    .leftJoin(campaigns, eq(campaigns.id, leads.campaignId))
    .where(and(eq(leads.id, leadId), eq(leads.userId, session.user.id)));

  if (!leadRow) return undefined;

  // Fetch events separately
  const events = await db
    .select()
    .from(leadEvents)
    .where(eq(leadEvents.leadId, leadId))
    .orderBy(desc(leadEvents.createdAt));

  // Fetch campaign details for message templates
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, leadRow.campaignId));

  return {
    id: leadRow.id,
    name: leadRow.name,
    email: leadRow.email,
    company: leadRow.company,
    position: leadRow.position,
    status: leadRow.status,
    stageConnectionRequested: leadRow.stageConnectionRequested,
    stageFirstFollowupSent: leadRow.stageFirstFollowupSent,
    stageSecondFollowupSent: leadRow.stageSecondFollowupSent,
    createdAt: leadRow.createdAt,
    campaign: { 
      name: leadRow.campaignName ?? '',
      requestMessageTemplate: campaign?.requestMessageTemplate,
      connectionMessageTemplate: campaign?.connectionMessageTemplate,
      firstFollowUpMessageTemplate: campaign?.firstFollowUpMessageTemplate,
      secondFollowUpMessageTemplate: campaign?.secondFollowUpMessageTemplate,
    },
    events,
  } as any;
}

// Action to create a new lead
export async function createLead(formData: { name: string; email: string; company?: string; campaignId: string; }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Not authenticated');

  await db.insert(leads).values({
    ...formData,
    userId: session.user.id,
    status: 'PENDING',
  });

  revalidatePath('/leads');
}
