import { NextRequest, NextResponse } from 'next/server';
import { getCampaignById } from '@/app/(main)/campaigns/[campaignId]/actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;
    const campaign = await getCampaignById(campaignId);
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      id: campaign.id,
      name: campaign.name,
      isActive: campaign.isActive 
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
