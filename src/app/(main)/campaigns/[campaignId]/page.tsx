import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCampaignById } from "./actions";
import { CampaignDetailsView } from "./_components/campaign-details-view";

export const dynamic = 'force-dynamic';

interface CampaignPageProps {
  params: {
    campaignId: string;
  };
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  try {
    const campaign = await getCampaignById(params.campaignId);
    
    if (!campaign) {
      redirect("/campaigns");
    }

    return <CampaignDetailsView campaign={campaign} />;
  } catch (error) {
    console.error("Failed to load campaign:", error);
    redirect("/campaigns");
  }
}