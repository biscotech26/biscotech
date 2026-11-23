"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Typography from "@/components/ui/typography";
import { API_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL } from "./inquiry";

// Sends an inquiry form (home "Let's talk" section, Contact page) to the backend's
// POST /api/inquiry. Only the fields a form has are sent; empty optional ones are left out.

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent"; message: string }
  // id: a fresh one per failed attempt, so a repeat of the same error shows (and times) again
  | { state: "error"; message: string; fields: string[]; id: number };

const FALLBACK_ERROR = "We couldn't send your message. Please try again.";

// The backend's field errors come as { field: "message" } or { field: ["message", ...] }
function fieldMessages(errors: unknown): string[] {
  if (!errors || typeof errors !== "object") return [];
  return Object.values(errors).flatMap((value) =>
    Array.isArray(value) ? value.map(String) : value ? [String(value)] : [],
  );
}

export function useInquiry(onSent?: () => void) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // Stable, so the toast's auto-close timer isn't restarted on every re-render
  const dismiss = useCallback(() => setStatus({ state: "idle" }), []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.state === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    const body: Record<string, string> = {};
    for (const key of ["name", "email", "business", "service", "estimate", "project", "website"]) {
      const value = data.get(key);
      if (typeof value === "string" && value.trim()) body[key] = value.trim();
    }

    setStatus({ state: "sending" });
    try {
      const res = await fetch(`${API_URL}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.success !== false) {
        form.reset();
        onSent?.();
        setStatus({ state: "sent", message: json?.message || "Thanks, we'll be in touch." });
        return;
      }
      setStatus({
        state: "error",
        message:
          json?.message ||
          (res.status === 429 ? "Too many messages. Please wait a moment and try again." : FALLBACK_ERROR),
        fields: fieldMessages(json?.errors),
        id: Date.now(),
      });
    } catch {
      // Offline, timed out or blocked
      setStatus({ state: "error", message: FALLBACK_ERROR, fields: [], id: Date.now() });
    }
  }

  return {
    status,
    sending: status.state === "sending",
    handleSubmit,
    dismiss,
  };
}

// Hidden "website" field: people never see or fill it, spam bots do, and the backend
// drops those submissions.
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

// Success message under the form; errors pop up as a toast at the top of the screen.
// Both are read out by screen readers.
export function InquiryStatus({
  status,
  onDismiss,
  className,
}: {
  status: ReturnType<typeof useInquiry>["status"];
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <>
      <div role="status" aria-live="polite" className={cn("w-full empty:hidden", className)}>
        {status.state === "sent" && (
          <Typography
            variant="body"
            className="rounded-[1.25rem] border border-light-teal/40 bg-light-teal/10 px-5 py-4 text-primary-brand"
          >
            {status.message}
          </Typography>
        )}
      </div>
      {status.state === "error" && (
        <ErrorToast key={status.id} status={status} onDismiss={onDismiss} />
      )}
    </>
  );
}

const TOAST_MS = 7000;

// Rendered into <body> so no animated/transformed section can trap the fixed position.
// Closes itself after a few seconds (not while hovered) or with the ✕.
function ErrorToast({
  status,
  onDismiss,
}: {
  status: Extract<ReturnType<typeof useInquiry>["status"], { state: "error" }>;
  onDismiss: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;
    const timer = setTimeout(onDismiss, TOAST_MS);
    return () => clearTimeout(timer);
  }, [hovered, onDismiss]);

  return createPortal(
    <div
      role="alert"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed inset-x-4 top-4 z-60 mx-auto max-w-md motion-safe:animate-toast-in print:hidden md:top-6"
    >
      <div className="flex items-start gap-3 rounded-[1.25rem] border border-red-300 bg-red-50 py-4 pr-3 pl-5 text-red-800 shadow-[0_1rem_2rem_-0.75rem_rgba(18,63,58,0.45)]">
        <div className="min-w-0 flex-1">
          <Typography variant="body">{status.message}</Typography>
          {status.fields.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {status.fields.map((message) => (
                <li key={message}>
                  <Typography variant="body" as="span">
                    {message}
                  </Typography>
                </li>
              ))}
            </ul>
          )}
          {status.fields.length === 0 && (
            <Typography variant="body" className="mt-2">
              You can also email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </Typography>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close message"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
