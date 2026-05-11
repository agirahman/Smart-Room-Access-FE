"use client"

import React from "react";
import { Toaster, toast } from "react-hot-toast";

export const AppToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      // Default options for all toasts
      duration: 4000,
      style: {
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)',
        fontFamily: 'var(--font-body)',
        fontSize: '14px'
      },
      success: {
        iconTheme: {
          primary: 'var(--status-online)',
          secondary: 'var(--bg-elevated)'
        }
      },
      error: {
        iconTheme: {
          primary: 'var(--status-offline)',
          secondary: 'var(--bg-elevated)'
        }
      }
    }}
  />
);

export const showSuccess = (message: string) => toast.success(message);
export const showError = (message: string) => toast.error(message);
export const showLoading = (message?: string) => toast.loading(message || 'Loading...');
export const dismissToast = (id?: string | number) => {
  const arg = typeof id === 'undefined' ? undefined : String(id);
  return toast.dismiss(arg);
};
export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string },
  opts?: Parameters<typeof toast.promise>[2]
) => toast.promise(promise, messages, opts)

export default toast;