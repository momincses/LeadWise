// components/layout/breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { IoFolderOpenOutline } from 'react-icons/io5';

/**
 * A utility function to capitalize the first letter of a string.
 * e.g., "leads" -> "Leads"
 */
const capitalize = (s: string) => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ');
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const [campaignName, setCampaignName] = useState<string>('');
  
  // Get the current page name from the pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Fetch campaign name if we're on a campaign details page
  useEffect(() => {
    if (pathname.startsWith('/campaigns/') && pathSegments.length > 1) {
      const campaignId = pathSegments[1];
      // Try to get campaign name from localStorage first (set by campaign details page)
      const storedName = localStorage.getItem(`campaign-${campaignId}-name`);
      if (storedName) {
        setCampaignName(storedName);
      } else {
        // Fallback: try to fetch from API
        fetch(`/api/campaigns/${campaignId}`)
          .then(res => res.json())
          .then(data => {
            if (data.name) {
              setCampaignName(data.name);
              localStorage.setItem(`campaign-${campaignId}-name`, data.name);
            }
          })
          .catch(() => {
            // Fallback to a generic name if fetch fails
            setCampaignName('Campaign');
          });
      }
    }
  }, [pathname, pathSegments]);
  
  // Handle different route patterns
  let breadcrumbItems: string[] = [];
  
  if (pathname === '/dashboard' || pathname === '/') {
    breadcrumbItems = ['Dashboard'];
  } else if (pathname === '/leads') {
    breadcrumbItems = ['Leads'];
  } else if (pathname === '/campaigns') {
    breadcrumbItems = ['Campaigns'];
  } else if (pathname.startsWith('/campaigns/') && pathSegments.length > 1) {
    const campaignId = pathSegments[1];
    const tab = pathSegments[2]; // overview, leads, sequence, settings
    
    // Build breadcrumb items
    breadcrumbItems = ['Campaigns'];
    
    if (campaignName) {
      breadcrumbItems.push(campaignName);
    } else {
      breadcrumbItems.push('Campaign');
    }
    
    // Add active tab if present
    if (tab && ['overview', 'leads', 'sequence', 'settings'].includes(tab)) {
      breadcrumbItems.push(capitalize(tab));
    }
  } else if (pathname === '/settings') {
    breadcrumbItems = ['Settings'];
  } else if (pathname === '/profile') {
    breadcrumbItems = ['Profile'];
  } else if (pathSegments.length > 0) {
    // Fallback: use the last segment
    breadcrumbItems = [capitalize(pathSegments[pathSegments.length - 1])];
  }

  // Consistent height container for all pages
  return (
    <div className="flex h-full min-h-[1.25rem] items-center">
      <nav aria-label="Breadcrumb ">
        <ol className="flex items-center gap-2 text-sm">
        <IoFolderOpenOutline className="h-4 w-4 text-muted-foreground" />

          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2">

              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <span
                className={cn(
                  index === breadcrumbItems.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
