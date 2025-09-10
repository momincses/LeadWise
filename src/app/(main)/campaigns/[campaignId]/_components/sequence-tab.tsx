// app/(main)/campaigns/[campaignId]/_components/sequence-tab.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateCampaignSequence } from '../actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Save } from 'lucide-react';
import type { Campaign } from '@/lib/types';

const availableFields = [
  '{{firstName}}',
  '{{lastName}}',
  '{{company}}',
  '{{position}}',
  '{{industry}}',
  '{{location}}',
  '{{recentPost}}',
  '{{mutualConnection}}'
];

export function SequenceTab({ campaign }: { campaign: Campaign }) {
  const [previewMode, setPreviewMode] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      requestMessageTemplate: campaign.requestMessageTemplate || '',
      connectionMessageTemplate: campaign.connectionMessageTemplate || '',
      firstFollowUpMessageTemplate: campaign.firstFollowUpMessageTemplate || '',
      firstFollowUpDelayDays: campaign.firstFollowUpDelayDays || 1,
      secondFollowUpMessageTemplate: campaign.secondFollowUpMessageTemplate || '',
      secondFollowUpDelayDays: campaign.secondFollowUpDelayDays || 3,
    },
  });

  const watchedValues = watch();

  const insertField = (field: string, templateName: string) => {
    const currentValue = watchedValues[templateName as keyof typeof watchedValues] || '';
    setValue(templateName as any, currentValue + field);
  };

  const onSubmit = async (data: any) => {
    try {
      await updateCampaignSequence(campaign.id, data);
      alert('Sequence saved successfully!');
    } catch (error) {
      alert('Failed to save sequence. Please try again.');
    }
  };

  const MessageTemplateCard = ({ 
    title, 
    description, 
    templateName, 
    placeholder, 
    delayFieldName 
  }: {
    title: string;
    description: string;
    templateName: string;
    placeholder: string;
    delayFieldName?: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={templateName}>Message Template</Label>
          <Textarea
            id={templateName}
            placeholder={placeholder}
            rows={4}
            {...register(templateName as any)}
          />
        </div>
        
        {delayFieldName && (
          <div className="space-y-2">
            <Label htmlFor={delayFieldName}>Send Delay (days)</Label>
            <Input
              id={delayFieldName}
              type="number"
              min="1"
              {...register(delayFieldName as any)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Available Fields</Label>
          <div className="flex flex-wrap gap-2">
            {availableFields.map((field) => (
              <Badge
                key={field}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => insertField(field, templateName)}
              >
                {field}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? 'Hide Preview' : 'Preview'}
          </Button>
        </div>

        {previewMode && (
          <div className="p-4 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Preview:</Label>
            <p className="text-sm mt-2 whitespace-pre-wrap">
              {watchedValues[templateName as keyof typeof watchedValues] || placeholder}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <MessageTemplateCard
        title="Request Message"
        description="Initial connection request message"
        templateName="requestMessageTemplate"
        placeholder="Hi {{firstName}}, I noticed your work at {{company}} and would love to connect!"
      />

      <MessageTemplateCard
        title="Connection Message"
        description="Message sent after connection is accepted"
        templateName="connectionMessageTemplate"
        placeholder="Thanks for connecting, {{firstName}}! I'd love to learn more about your role at {{company}}."
      />

      <MessageTemplateCard
        title="First Follow-up Message"
        description="First follow-up message in the sequence"
        templateName="firstFollowUpMessageTemplate"
        placeholder="Hi {{firstName}}, I hope you're doing well! I wanted to follow up on our connection..."
        delayFieldName="firstFollowUpDelayDays"
      />

      <MessageTemplateCard
        title="Second Follow-up Message"
        description="Second follow-up message in the sequence"
        templateName="secondFollowUpMessageTemplate"
        placeholder="Hi {{firstName}}, I hope this message finds you well. I wanted to reach out again..."
        delayFieldName="secondFollowUpDelayDays"
      />

      <div className="flex justify-end">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Save Sequence
        </Button>
      </div>
    </form>
  );
}