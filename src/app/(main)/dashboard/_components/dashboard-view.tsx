"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadProfileDrawer } from "@/app/(main)/leads/_components/lead-profile-drawer";
import { useLeadsStore } from "@/stores/leads.store";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { CampaignWithStats } from "@/lib/types";

interface DashboardViewProps {
  initialData: {
    recentLeads: any[];
    campaigns: CampaignWithStats[];
  };
  initialLinkedInAccounts: any[];
}

export function DashboardView({ initialData, initialLinkedInAccounts }: DashboardViewProps) {
  const { setSelectedLead, openDrawer } = useLeadsStore();

  const { recentLeads, campaigns } = initialData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your campaigns and recent activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left Column - Campaigns and LinkedIn */}
        <div className="space-y-6">
          {/* Campaigns Section */}
          <Card className="flex-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Campaigns</CardTitle>
                <Button variant="outline" size="sm">
                  All Campaigns
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex justify-between items-center p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.stats.totalLeads} leads
                      </p>
                    </div>
                    <Badge 
                      className={campaign.isActive ? "bg-green-500 text-white" : "bg-gray-400 text-white"}
                    >
                      {campaign.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No campaigns yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Accounts Section */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>LinkedIn Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {initialLinkedInAccounts.map((account) => (
                  <div key={account.id} className="flex justify-between items-center p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500 text-white mb-1">
                        {account.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {account.requests}/{account.maxRequests}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity (Full Height) */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="outline" size="sm">
                Most Recent
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead.id);
                    openDrawer();
                  }}
                  className="flex justify-between items-center p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{lead.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {lead.position}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Campaign: {lead.campaign}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      lead.status === "PENDING"
                        ? "bg-purple-500 text-white"
                        : lead.status === "ACCEPTED"
                        ? "bg-green-500 text-white"
                        : lead.status === "MESSAGED"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-400 text-white"
                    }
                  >
                    {lead.status === "PENDING" ? "Pending Approval" : lead.status}
                  </Badge>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <LeadProfileDrawer />
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Left Column Skeleton */}
      <div className="space-y-6">
        {/* Campaigns Skeleton */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* LinkedIn Accounts Skeleton */}
        <Card className="flex-1">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48 mt-1" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column Skeleton */}
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-28" />
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                    <Skeleton className="h-3 w-20 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export { DashboardSkeleton };
