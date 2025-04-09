'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface EmbedScriptDialogProps {
  isOpen: boolean;
  scriptUrl: string;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function EmbedScriptDialog({
  isOpen,
  scriptUrl,
  onOpenChange,
  onContinue,
}: EmbedScriptDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (scriptUrl) {
      navigator.clipboard.writeText(`<script src="${scriptUrl}"></script>`);
      setCopied(true);
      toast.success('Script copied to clipboard!');

      // Reset copy icon after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // Handle dialog state changes
  const handleOpenChange = (open: boolean) => {
    // First update the parent component's state
    onOpenChange(open);

    // If the dialog is closing, redirect after a short delay to allow the dialog animation to complete
    if (!open) {
      setTimeout(() => {
        onContinue();
      }, 150); // Small delay for smoother transition
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md xl:max-w-xl [&_button[data-radix-collection-item]]:hidden">
        <DialogHeader>
          <DialogTitle>Embedded Script</DialogTitle>
          <DialogDescription>
            Use this script to embed your chatbot in your website
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-start space-x-2">
            <div className="min-w-0 flex-1 rounded-md bg-muted p-4 text-sm">
              <code className="whitespace-normal break-all text-xs sm:text-sm">
                {`<script src="${scriptUrl || 'No URL available'}"></script>`}
              </code>
            </div>
            <Button
              onClick={handleCopy}
              className="btn-secondary shrink-0 rounded-md p-1"
              size={'icon'}
              aria-label="Copy URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-custom-teal dark:text-custom-hoverdark" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="default" onClick={onContinue}>
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
