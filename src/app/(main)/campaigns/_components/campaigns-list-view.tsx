// app/(main)/campaigns/_components/campaigns-list-view.tsx
'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button'; // No longer need Button here
import { CampaignsTable } from './campaigns-table';
import type { CampaignWithStats } from '@/lib/types';
import { CreateCampaignDialog } from './create-campaign-dialog'; // ✅ Import the new component

export function CampaignsListView({ initialCampaigns }: { initialCampaigns: CampaignWithStats[] }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = useMemo(() => {
    return initialCampaigns
      .filter((c) => {
        if (filter === 'active') return c.isActive;
        if (filter === 'inactive') return !c.isActive;
        return true;
      })
      .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filter, searchTerm, initialCampaigns]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search Campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          {/* ✅ Replace the old button with the new dialog component */}
          <CreateCampaignDialog />
        </div>
      </div>
      <CampaignsTable campaigns={filteredCampaigns} />
    </div>
  );
}