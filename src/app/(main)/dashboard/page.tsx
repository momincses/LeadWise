import { auth } from "@/lib/auth";
import { DashboardView, DashboardSkeleton } from "./_components/dashboard-view";
import { getDashboardData, getLinkedInAccounts } from "./actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'; // Ensures data is always fresh

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  try {
    const [dashboardData, linkedInAccounts] = await Promise.all([
      getDashboardData(),
      getLinkedInAccounts(),
    ]);

    return (
      <DashboardView 
        initialData={dashboardData} 
        initialLinkedInAccounts={linkedInAccounts} 
      />
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    // Return empty data if there's an error
    return (
      <DashboardView 
        initialData={{ recentLeads: [], campaigns: [] }} 
        initialLinkedInAccounts={[]} 
      />
    );
  }
};

export default Page;