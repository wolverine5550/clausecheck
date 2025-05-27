// TODO: Switch to shadcn/ui CopyButton if/when available. Currently using a custom implementation.
// CopyButton: Copies provided text to clipboard and shows a toast
// Uses shadcn/ui Button and Toast
// Props: text (string)
// Accessible and minimal logic

import React from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

/**
 * Props for CopyButton
 */
export interface CopyButtonProps {
  text: string;
}

/**
 * CopyButton component
 * Copies the provided text to clipboard and shows a toast
 */
export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Suggestion copied to clipboard.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
      });
    }
  };

  return (
    <Button type="button" size="sm" onClick={handleCopy} aria-label="Copy suggestion">
      Copy
    </Button>
  );
};
