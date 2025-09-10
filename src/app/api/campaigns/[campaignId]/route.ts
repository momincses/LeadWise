import { NextRequest, NextResponse } from 'next/server';
import { getCampaignById } from '@/app/(main)/campaigns/[campaignId]/actions';

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const campaign = await getCampaignById(params.campaignId);
    
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
