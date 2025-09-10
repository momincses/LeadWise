// app/(main)/campaigns/page.tsx
import { getCampaignsForUser } from './actions';
import { CampaignsListView } from './_components/campaigns-list-view';

export const dynamic = 'force-dynamic'; // Ensures data is always fresh

export default async function CampaignsPage() {
  try {
    const campaigns = await getCampaignsForUser();
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <CampaignsListView initialCampaigns={campaigns} />
      </div>
    );
  } catch (error) {
    // Return empty campaigns list if there's an error (e.g., no campaigns yet)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <CampaignsListView initialCampaigns={[]} />
      </div>
    );
  }
}