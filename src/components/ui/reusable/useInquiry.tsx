"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { CONTACT_EMAIL } from "./inquiry";

// Sends an inquiry form (home "Let's talk" section, Contact page) to the backend's
// POST /api/inquiry. Only the fields a form has are sent; empty optional ones are left out.
// The result pops up as a toast (Toaster in the root layout).

const FALLBACK_ERROR = "We couldn't send your message. Please try again.";

// The backend's field errors come as { field: "message" } or { field: ["message", ...] }
function fieldMessages(errors: unknown): string[] {
  if (!errors || typeof errors !== "object") return [];
  return Object.values(errors).flatMap((value) =>
    Array.isArray(value) ? value.map(String) : value ? [String(value)] : [],
  );
}

function showError(message: string, fields: string[] = []) {
  toast.error(message, {
    description:
      fields.length > 0 ? (
        <ul className="list-disc pl-4">
          {fields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      ) : (
        <>
          You can also email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </>
      ),
  });
}

export function useInquiry(onSent?: () => void) {
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);

    const body: Record<string, string> = {};
    for (const key of ["name", "email", "business", "service", "estimate", "project", "website"]) {
      const value = data.get(key);
      if (typeof value === "string" && value.trim()) body[key] = value.trim();
    }

    setSending(true);
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
        toast.success(json?.message || "Thanks, we'll be in touch.");
        return;
      }
      showError(
        json?.message ||
          (res.status === 429 ? "Too many messages. Please wait a moment and try again." : FALLBACK_ERROR),
        fieldMessages(json?.errors),
      );
    } catch {
      // Offline, timed out or blocked
      showError(FALLBACK_ERROR);
    } finally {
      setSending(false);
    }
  }

  return { sending, handleSubmit };
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
