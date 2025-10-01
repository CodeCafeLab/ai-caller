import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './dialog';

interface Webhook {
  id: string;
  name: string;
  url: string;
  auth_method?: string;
}

interface WebhookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  onWebhookSelect: (webhookId: string) => void;
}

export default function WebhookModal({ open, onOpenChange, agentId, onWebhookSelect }: WebhookModalProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setFetching(true);
    setError(null);
    fetch('https://api.elevenlabs.io/v1/workspace/webhooks', {
      headers: {
        'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
        'Content-Type': 'application/json',
      },
    })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch webhooks');
        const data = await res.json();
        setWebhooks(Array.isArray(data.webhooks) ? data.webhooks : []);
      })
      .catch(e => setError(e.message || 'Failed to fetch webhooks'))
      .finally(() => setFetching(false));
  }, [open]);

  const handleWebhookSelect = (webhookId: string) => {
    onWebhookSelect(webhookId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md bg-card text-card-foreground border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Select Webhook</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {fetching ? (
            <div className="p-4 text-muted-foreground">Loading webhooks...</div>
          ) : error ? (
            <div className="p-4 text-destructive">{error}</div>
          ) : webhooks.length === 0 ? (
            <div className="p-4">
              <div className="text-muted-foreground mb-2">No webhooks found.</div>
              <a
                href="https://elevenlabs.io/dashboard/webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-sm"
              >
                Create webhook in ElevenLabs
              </a>
            </div>
          ) : (
            webhooks.map(webhook => (
              <div
                key={webhook.id}
                className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer"
                onClick={() => handleWebhookSelect(webhook.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                    ⚡
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{webhook.name}</div>
                    <div className="text-muted-foreground text-xs truncate">{webhook.url}</div>
                    <div className="text-muted-foreground text-xs">
                      Auth Method: {webhook.auth_method || 'None'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 