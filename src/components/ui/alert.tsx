// Alert component for inline feedback (errors, warnings, info)
// Uses shadcn/ui and Radix primitives for accessibility and style
// Usage: <Alert variant="destructive">Error message</Alert>

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-4 flex items-start gap-3', {
  variants: {
    variant: {
      default: 'border-border bg-background text-foreground',
      destructive: 'border-destructive bg-destructive/10 text-destructive',
      warning: 'border-yellow-400 bg-yellow-50 text-yellow-900',
      success: 'border-green-500 bg-green-50 text-green-900',
      info: 'border-blue-400 bg-blue-50 text-blue-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

/**
 * Alert component for inline feedback (errors, warnings, info).
 * @param variant - 'default' | 'destructive' | 'warning' | 'success' | 'info'
 * @param icon - Optional icon to display (defaults by variant)
 * @param children - Alert content
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    let defaultIcon = null;
    if (icon) {
      defaultIcon = icon;
    } else if (variant === 'destructive') {
      defaultIcon = <AlertTriangle className="h-5 w-5 text-destructive" />;
    } else if (variant === 'warning') {
      defaultIcon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else if (variant === 'success') {
      defaultIcon = <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (variant === 'info') {
      defaultIcon = <Info className="h-5 w-5 text-blue-500" />;
    }
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        {defaultIcon && <span className="mt-0.5">{defaultIcon}</span>}
        <div className="flex-1">{children}</div>
      </div>
    );
  },
);
Alert.displayName = 'Alert';
