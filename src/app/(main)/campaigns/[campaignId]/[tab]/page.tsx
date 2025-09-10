import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCampaignById } from "../actions";
import { CampaignDetailsView } from "../_components/campaign-details-view";

export const dynamic = 'force-dynamic';

interface CampaignTabPageProps {
  params: {
    campaignId: string;
    tab: string;
  };
}

export default async function CampaignTabPage({ params }: CampaignTabPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Validate tab parameter
  const validTabs = ['overview', 'leads', 'sequence', 'settings'];
  if (!validTabs.includes(params.tab)) {
    redirect(`/campaigns/${params.campaignId}/overview`);
  }

  try {
    const campaign = await getCampaignById(params.campaignId);
    
    if (!campaign) {
      redirect("/campaigns");
    }

    return <CampaignDetailsView campaign={campaign} defaultTab={params.tab} />;
  } catch (error) {
    console.error("Failed to load campaign:", error);
    redirect("/campaigns");
  }
}
