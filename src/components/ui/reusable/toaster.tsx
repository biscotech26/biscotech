"use client";
import type { CSSProperties } from "react";
import { Toaster as Sonner } from "sonner";

// The site's toasts (Sonner), placed once in the root layout. Call toast.success(...) /
// toast.error(...) from "sonner" anywhere. Top centre so they don't sit under the WhatsApp
// button; site colours, DM Sans and 20px corners. They pause while hovered and can be
// swiped away on phones.
export default function Toaster() {
  return (
    <Sonner
      position="top-center"
      richColors
      closeButton
      duration={7000}
      className="print:hidden"
      toastOptions={{ className: "font-dm-sans! rounded-[1.25rem]! text-sm! md:text-base!" }}
      style={
        {
          "--normal-bg": "var(--cards-and-sections)",
          "--normal-border": "var(--secondary-accent)",
          "--normal-text": "var(--primary-brand)",
          "--success-bg": "var(--cards-and-sections)",
          "--success-border": "var(--light-teal)",
          "--success-text": "var(--primary-brand)",
          "--error-bg": "#fef2f2",
          "--error-border": "#fca5a5",
          "--error-text": "#991b1b",
        } as CSSProperties
      }
    />
  );
}
