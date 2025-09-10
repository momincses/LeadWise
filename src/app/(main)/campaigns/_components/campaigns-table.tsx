"use client";

import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "../actions";
import { queryKeys } from "@/lib/query-keys";
import type { CampaignWithStats } from "@/lib/types";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaEnvelope, // Import the icon for messages
} from "react-icons/fa";

const statusColors = {
  Active: "bg-green-500/20 text-green-500 border-green-500/20",
  Paused: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
  Completed: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  Draft: "bg-gray-500/20 text-gray-400 border-gray-500/20",
};

// We pass the server-fetched data as initialData to prevent a loading flash
export function CampaignsTable({
  campaigns,
}: {
  campaigns: CampaignWithStats[];
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.campaigns.lists(),
    queryFn: () => getCampaigns(),
    initialData: campaigns,
  });

  if (isLoading) return <div>Loading campaigns...</div>;
  if (isError) return <div>Failed to load campaigns.</div>;

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="text-muted-foreground">
          No campaigns found. Create your first campaign to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Campaign Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Total Leads</TableHead>
            <TableHead className="text-center">Request Status</TableHead>
            <TableHead className="text-center">Connection Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((campaign) => {
            return (
              <TableRow
                key={campaign.id}
                className="cursor-pointer hover:bg-muted/50 h-15"
                onClick={() => router.push(`/campaigns/${campaign.id}`)}
              >
                {/* Campaign Name - Left-aligned for better readability */}
                <TableCell className="font-medium">{campaign.name}</TableCell>

                {/* Status - Centered */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      statusColors[campaign.isActive ? "Active" : "Paused"]
                    }
                  >
                    {campaign.isActive ? "Active" : "Paused"}
                  </Badge>
                </TableCell>

                {/* Total Leads - Centered */}
                <TableCell className="text-center">
                  {campaign.stats.totalLeads}
                </TableCell>

                {/* Request Status - Centered with Pills */}
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {/* ACCEPTED (Green Pill) */}
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                      title={`${campaign.stats.requests.accepted} Accepted`}
                    >
                      <FaUserCheck className="h-3.5 w-3.5" />
                      {campaign.stats.requests.accepted}
                    </div>
                    {/* PENDING (Orange Pill) */}
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"
                      title={`${campaign.stats.requests.pending} Pending`}
                    >
                      <FaUserClock className="h-3.5 w-3.5" />
                      {campaign.stats.requests.pending}
                    </div>
                    {/* REJECTED (Red Pill) */}
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800"
                      title={`${campaign.stats.requests.rejected} Rejected`}
                    >
                      <FaUserTimes className="h-3.5 w-3.5" />
                      {campaign.stats.requests.rejected}
                    </div>
                  </div>
                </TableCell>

                {/* Connection Status - Centered with Pills (NEW DESIGN) */}
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {/* CONNECTED (Green Pill) */}
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                      title={`${campaign.stats.requests.accepted} Connected`}
                    >
                      <FaUserCheck className="h-3.5 w-3.5" />
                      {campaign.stats.requests.accepted}
                    </div>
                    {/* MESSAGED (Blue Pill) */}
                    <div
                      className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800"
                      title={`${campaign.stats.connections.messaged} Messaged`}
                    >
                      <FaEnvelope className="h-3.5 w-3.5" />
                      {campaign.stats.connections.messaged}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
