// app/(main)/leads/_components/leads-list-view.tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getLeads } from "../actions";
import { useEffect, useState, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadProfileDrawer } from "./lead-profile-drawer";
import { AddLeadDialog } from "./add-lead-dialog";
import { useLeadsStore } from "@/stores/leads.store";

export function LeadsListView({ initialLeads }: { initialLeads: any[] }) {
  const { setSelectedLead, openDrawer } = useLeadsStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["leads"],
      queryFn: async ({ pageParam = 0 }) =>
        getLeads({ page: pageParam, limit: 15 }),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length : undefined;
      },
      initialData: { pages: [initialLeads], pageParams: [0] },
      initialPageParam: 0,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const leads = data?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-muted-foreground">
            A comprehensive list of all your leads.
          </p>
        </div>
        <AddLeadDialog />
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead className="text-center">Campaign Name</TableHead>
              <TableHead className="text-center">Activity</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>

          {/* Apply padding + alignment to all td in this tbody */}
          <TableBody className="[&>tr>td]:py-3 [&>tr>td]:px-4 [&>tr>td]:align-middle">
            {leads.map((lead: any, index: number) => (
              <TableRow
                key={index}
                onClick={() => {
                  setSelectedLead(lead.id);
                  openDrawer();
                }}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                {/* Avatar + Name + Position */}
                <TableCell className="w-[400px] font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={lead.avatar} alt={lead.name} />
                      <AvatarFallback>{lead.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {lead.position}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Campaign */}
                <TableCell className="text-center">{lead.campaign}</TableCell>

                {/* Activity (3 stage bars) */}
                <TableCell>
                  <div className="flex gap-1 justify-center items-end h-5">
                    <div
                      className={`w-1.5 h-9 rounded-sm ${
                        lead.stageConnectionRequested
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                      title="Connection Request"
                    />
                    <div
                      className={`w-1.5 h-9 rounded-sm ${
                        lead.stageFirstFollowupSent
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                      title="First Follow-up"
                    />
                    <div
                      className={`w-1.5 h-9 rounded-sm ${
                        lead.stageSecondFollowupSent
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                      title="Second Follow-up"
                    />
                  </div>
                </TableCell>

                {/* Status (colored badge) */}
                <TableCell className="text-center">
                  <Badge
                    className={
                      lead.status === "Pending Approval"
                        ? "bg-purple-500 text-white"
                        : lead.status.includes("Sent")
                        ? "bg-orange-500 text-white"
                        : lead.status.includes("Followup")
                        ? "bg-blue-500 text-white"
                        : "bg-gray-400 text-white"
                    }
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {isFetchingNextPage && <TableLoader rows={3} />}
          </TableBody>
        </Table>
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-1" />

      <LeadProfileDrawer />
    </div>
  );
}

const TableLoader = ({ rows = 5 }: { rows?: number }) => (
  <Fragment>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-10 w-full" />
        </TableCell>
      </TableRow>
    ))}
  </Fragment>
);
