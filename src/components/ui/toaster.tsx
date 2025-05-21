'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from './toast';

// Type for toasts with extra fields
export type ToastWithExtras = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function Toaster() {
  const { toasts } = useToast() as { toasts: ToastWithExtras[] };

  return (
    <ToastProvider>
      {toasts.map((toast: ToastWithExtras) => {
        const { id, title, description, action, ...props } = toast;
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
