import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCampaignById } from "../actions";
import { CampaignDetailsView } from "../_components/campaign-details-view";

export const dynamic = 'force-dynamic';

interface CampaignTabPageProps {
  params: Promise<{
    campaignId: string;
    tab: string;
  }>;
}

export default async function CampaignTabPage({ params }: CampaignTabPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { campaignId, tab } = await params;

  // Validate tab parameter
  const validTabs = ['overview', 'leads', 'sequence', 'settings'];
  if (!validTabs.includes(tab)) {
    redirect(`/campaigns/${campaignId}/overview`);
  }

  try {
    const campaign = await getCampaignById(campaignId);
    
    if (!campaign) {
      redirect("/campaigns");
    }

    return <CampaignDetailsView campaign={campaign} defaultTab={tab} />;
  } catch (error) {
    console.error("Failed to load campaign:", error);
    redirect("/campaigns");
  }
}
