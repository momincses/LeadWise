'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OverviewTab } from './overview-tab';
import { LeadsTab } from './leads-tab';
import { SequenceTab } from './sequence-tab';
import { SettingsTab } from './settings-tab';
import type { Campaign } from '@/lib/types';

interface CampaignDetailsViewProps {
  campaign: Campaign;
  defaultTab?: string;
}

export function CampaignDetailsView({ campaign, defaultTab = 'overview' }: CampaignDetailsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Store campaign name in localStorage for breadcrumbs
  useEffect(() => {
    if (campaign.name) {
      localStorage.setItem(`campaign-${campaign.id}-name`, campaign.name);
    }
  }, [campaign.id, campaign.name]);

  // Handle tab changes and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL to include the tab
    const newUrl = `/campaigns/${campaign.id}/${value}`;
    router.push(newUrl);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={campaign.isActive ? "default" : "secondary"}>
              {campaign.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created {new Date(campaign.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="sequence">Sequence</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab campaign={campaign} />
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <LeadsTab campaignId={campaign.id} />
        </TabsContent>

        <TabsContent value="sequence" className="space-y-6">
          <SequenceTab campaign={campaign} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsTab campaign={campaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
}