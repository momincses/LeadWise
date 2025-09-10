// app/(main)/leads/_components/lead-profile-drawer.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getLeadDetails } from "../actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useLeadsStore } from "@/stores/leads.store";
import { useState } from "react";

export function LeadProfileDrawer() {
  const { selectedLeadId, isDrawerOpen, closeDrawer } = useLeadsStore();
  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ["leadDetails", selectedLeadId],
    queryFn: () => getLeadDetails(selectedLeadId!),
    enabled: !!selectedLeadId,
  });

  const [showProfileInfo, setShowProfileInfo] = useState(true);

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className="w-[460px] sm:max-w-none">
        <div className="h-full overflow-y-auto pr-3">
          {isLoading && <DrawerSkeleton />}
          {isError && (
            <p className="p-4 text-red-500">Could not load lead details.</p>
          )}
          {lead && (
            <>
              {/* Profile Section */}
              <SheetHeader>
                <div className="flex flex-col items-center text-center gap-3 py-6">
                  <Avatar className="h-24 w-24 shadow">
                    <AvatarImage src={lead.avatarUrl} alt={lead.name} />
                    <AvatarFallback>
                      {lead.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{lead.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {lead.position} at {lead.company}
                    </p>
                    <div className="flex gap-2 flex-wrap justify-center mt-2">
                      <Badge variant="secondary">{lead.campaign.name}</Badge>
                      <Badge>{lead.status}</Badge>
                      {lead.lastContacted && (
                        <Badge className="bg-muted text-muted-foreground">
                          Sent {timeAgo(lead.lastContacted)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </SheetHeader>

              {/* Additional Profile Info (toggleable) */}
              <div className="px-4">
                <button
                  onClick={() => setShowProfileInfo((prev) => !prev)}
                  className="flex w-full justify-between items-center font-medium py-2 border-b"
                >
                  Additional Profile Info
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showProfileInfo ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showProfileInfo && (
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p>{lead.email}</p>
                    {lead.phone && <p>{lead.phone}</p>}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="mt-8 px-4">
                <h3 className="font-semibold mb-4">Campaign Timeline</h3>
                <div className="space-y-6 pl-6">
                  <TimelineItem
                    label="Connection Request"
                    active={lead.stageConnectionRequested}
                    message={
                      lead.campaign.requestMessageTemplate ||
                      "No message template set"
                    }
                  />
                  <TimelineItem
                    label="First Follow-up"
                    active={lead.stageFirstFollowupSent}
                    message={
                      lead.campaign.firstFollowUpMessageTemplate ||
                      "No message template set"
                    }
                  />
                  <TimelineItem
                    label="Second Follow-up"
                    active={lead.stageSecondFollowupSent}
                    message={
                      lead.campaign.secondFollowUpMessageTemplate ||
                      "No message template set"
                    }
                    isLast={lead.events?.length === 0} // stop if no extra events
                  />

                  {/* Extra events */}
                  {lead.events?.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-3">Additional Events</h4>
                      {lead.events.map((event: any, idx: number) => (
                        <TimelineItem
                          key={event.id}
                          label={event.type.replace(/_/g, " ")}
                          active
                          message={event.message}
                          time={new Date(event.createdAt).toLocaleString()}
                          isLast={idx === lead.events.length - 1} // last event -> no line
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* Timeline Item component */
const TimelineItem = ({
  label,
  message,
  active,
  time,
  isLast = false,
}: {
  label: string;
  message: string;
  active: boolean;
  time?: string;
  isLast?: boolean;
}) => (
  <div className="relative flex gap-4">
    {/* Circle + line */}
    <div className="absolute -left-[22px] flex flex-col items-center">
      {/* Circle */}
      <div
        className={`h-6 w-6 rounded-full flex items-center justify-center z-10 ${
          active ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
      </div>

      {/* Connecting line (hidden for last item) */}
      {!isLast && (
        <div className="w-px flex-1 border-l-2 border-dashed border-muted-foreground/40 mt-1"></div>
      )}
    </div>

    {/* Content */}
    <div className="flex-1 ml-3">
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/80 mt-1">
        {active ? "Sent" : "Pending"}
        {time ? ` • ${time}` : ""}
      </p>
    </div>
  </div>
);

/* Skeleton Loader */
const DrawerSkeleton = () => (
  <div className="space-y-8 p-4">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  </div>
);

/* Helper for "Sent x mins ago" */
function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
