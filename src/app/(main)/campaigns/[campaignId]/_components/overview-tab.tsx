// app/(main)/campaigns/[campaignId]/_components/overview-tab.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Campaign } from '@/lib/types';

export function OverviewTab({ campaign }: { campaign: Campaign }) {
  // Mock data - in real app, this would come from props or API
  const stats = {
    totalLeads: 0,
    requestSent: 0,
    requestAccepted: 0,
    requestReplied: 0,
  };

  const acceptanceRate = stats.requestSent > 0 ? (stats.requestAccepted / stats.requestSent) * 100 : 0;
  const replyRate = stats.requestAccepted > 0 ? (stats.requestReplied / stats.requestAccepted) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +0% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Request Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requestSent}</div>
            <p className="text-xs text-muted-foreground">
              +0% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Request Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requestAccepted}</div>
            <p className="text-xs text-muted-foreground">
              {acceptanceRate.toFixed(1)}% acceptance rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Request Replied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requestReplied}</div>
            <p className="text-xs text-muted-foreground">
              {replyRate.toFixed(1)}% reply rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Progress */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Progress</CardTitle>
            <CardDescription>
              Track your campaign's performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Acceptance Rate</span>
                <span>{acceptanceRate.toFixed(1)}%</span>
              </div>
              <Progress value={acceptanceRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reply Rate</span>
                <span>{replyRate.toFixed(1)}%</span>
              </div>
              <Progress value={replyRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Key information about this campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Start Date</span>
              <span className="text-sm font-medium">
                {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={campaign.isActive ? "default" : "secondary"}>
                {campaign.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <span className="text-sm font-medium">0.0%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}