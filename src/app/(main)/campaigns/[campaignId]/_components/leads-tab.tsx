// app/(main)/campaigns/[campaignId]/_components/leads-tab.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getCampaignLeads } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LeadProfileDrawer } from '@/app/(main)/leads/_components/lead-profile-drawer';
import { useLeadsStore } from '@/stores/leads.store';
import { AddLeadDialog } from '@/app/(main)/leads/_components/add-lead-dialog';

export function LeadsTab({ campaignId }: { campaignId: string }) {
  const { setSelectedLead, openDrawer } = useLeadsStore();

  const { data: leads, isLoading, isError } = useQuery({
    queryKey: ['campaign-leads', campaignId],
    queryFn: () => getCampaignLeads(campaignId),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-purple-500 text-white';
      case 'ACCEPTED':
        return 'bg-green-500 text-white';
      case 'REJECTED':
        return 'bg-red-500 text-white';
      case 'MESSAGED':
        return 'bg-blue-500 text-white';
      case 'CONNECTED':
        return 'bg-emerald-500 text-white';
      case 'NOT_INTERESTED':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusDisplay = (status: string) => {
    return status === 'PENDING' ? 'Pending Approval' : status;
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Leads</CardTitle>
          <CardDescription>Loading leads...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load leads. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Campaign Leads</CardTitle>
              <CardDescription>
                Manage and track leads for this specific campaign ({leads?.length || 0} leads)
              </CardDescription>
            </div>
            <AddLeadDialog />
          </div>
        </CardHeader>
        <CardContent>
          {!leads || leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leads found for this campaign.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add leads to this campaign to start tracking their progress.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead>Position & Company</TableHead>
                    <TableHead className="text-center">Activity</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedLead(lead.id);
                        openDrawer();
                      }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{lead.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{lead.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {lead.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.position || 'No position'}</div>
                          <div className="text-sm text-muted-foreground">
                            {lead.company || 'No company'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center items-end h-5">
                          <div
                            className={`w-1.5 h-9 rounded-sm ${
                              lead.stageConnectionRequested ? "bg-primary" : "bg-gray-300"
                            }`}
                            title="Connection Request"
                          />
                          <div
                            className={`w-1.5 h-9 rounded-sm ${
                              lead.stageFirstFollowupSent ? "bg-primary" : "bg-gray-300"
                            }`}
                            title="First Follow-up"
                          />
                          <div
                            className={`w-1.5 h-9 rounded-sm ${
                              lead.stageSecondFollowupSent ? "bg-primary" : "bg-gray-300"
                            }`}
                            title="Second Follow-up"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusColor(lead.status)}>
                          {getStatusDisplay(lead.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead.id);
                                openDrawer();
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <LeadProfileDrawer />
    </>
  );
}