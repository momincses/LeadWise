// app/(main)/leads/page.tsx
import { getLeads } from './actions';
import { LeadsListView } from './_components/leads-list-view';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const initialLeads = await getLeads({ page: 0, limit: 15 }); // Fetch first page
  return <LeadsListView initialLeads={initialLeads} />;
}