// app/(main)/leads/_components/add-lead-dialog.tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createLead } from '../actions';
import { getCampaignsForUser } from '../../campaigns/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AddLeadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch campaigns for the dropdown
  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({ 
    queryKey: ['campaignsList'], 
    queryFn: () => getCampaignsForUser() 
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; company?: string; campaignId: string }) => {
      await createLead(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead added successfully!');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to add lead. Please try again.');
      console.error('Create lead error:', error);
    },
  });

  const handleSubmit = (formData: FormData) => {
    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        campaignId: formData.get('campaignId') as string,
    }
    
    if (!data.campaignId) {
      toast.error('Please select a campaign');
      return;
    }
    
    createLeadMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Fill in the details below and assign the lead to a campaign.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" placeholder="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaignId">Assign to Campaign</Label>
            <Select name="campaignId" required>
              <SelectTrigger disabled={isLoadingCampaigns}>
                <SelectValue placeholder={isLoadingCampaigns ? "Loading campaigns..." : "Select a campaign"} />
              </SelectTrigger>
              <SelectContent>
                {campaigns?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createLeadMutation.isPending}>
              {createLeadMutation.isPending ? 'Adding Lead...' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}