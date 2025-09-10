// app/(main)/campaigns/[campaignId]/_components/settings-tab.tsx
'use client';

import { useForm } from 'react-hook-form';
import { updateCampaignSettings } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import type { Campaign } from '@/lib/types';

export function SettingsTab({ campaign }: { campaign: Campaign }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: campaign.name,
      isActive: campaign.isActive,
      allowNoPersonalization: campaign.allowNoPersonalization,
    },
  });

  const onSubmit = async (data: { name: string, isActive: boolean }) => {
    try {
      await updateCampaignSettings(campaign.id, data);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campaign Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Configure the basic settings for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input 
                id="name" 
                placeholder="Enter campaign name"
                {...register('name')} 
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label>Campaign Status</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle the campaign between active and inactive. Inactive campaigns won't send messages.
                </p>
              </div>
              <Switch defaultChecked={campaign.isActive} {...register('isActive')} />
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label>Request without personalization</Label>
                <p className="text-sm text-muted-foreground">
                  Allow sending requests even if personalization fails. This may reduce acceptance rates.
                </p>
              </div>
              <Switch defaultChecked={campaign.allowNoPersonalization || false} {...register('allowNoPersonalization')} />
            </div>
          </CardContent>
        </Card>

        {/* AutoPilot Mode Section */}
        <Card>
          <CardHeader>
            <CardTitle>AutoPilot Mode</CardTitle>
            <CardDescription>
              Configure automated message sending and account selection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="selectedAccount">Selected Account</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account for AutoPilot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account1">LinkedIn Account 1</SelectItem>
                  <SelectItem value="account2">LinkedIn Account 2</SelectItem>
                  <SelectItem value="account3">LinkedIn Account 3</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose which LinkedIn account to use for sending messages automatically.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label>Enable AutoPilot</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send messages according to your sequence schedule.
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label>Smart Timing</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically optimize message sending times based on lead activity.
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}