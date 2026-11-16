import { cn } from "@/lib/utils";
import { variantStyles } from "@/components/ui/typography";

// Shared by every inquiry form (home "Let's talk" section, Contact page).
// Plain module (no "use client") so both server and client components can import it.

export const CONTACT_EMAIL = "info@biscotech.org";

export const services = [
  "Website design & dev",
  "Branding & visual identity",
  "Digital marketing",
  "Social media management",
  "Academy / training",
  "Something else",
];

export const estimates = [
  "I'd like to discuss this",
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000+",
];

// Field styling from Figma: white field, sage border, 20px Manrope text
export const fieldClass = cn(
  "border-secondary-accent bg-cards-and-sections text-primary-brand placeholder:text-secondary-accent",
  variantStyles.cardHeading,
);
export const labelClass = "text-primary-brand";
// Phones: shorter fields and a tighter label gap; md+ keeps the Figma spacing
export const fieldContainer = "gap-2 md:gap-[1.125rem]";
export const compactField = "py-3 md:py-[1.125rem]";

// No backend yet: opens the visitor's email app with the form's answers filled in.
// Only the fields a form actually has are included.
export function openInquiryEmail(data: FormData) {
  const lines = [
    ["Name", data.get("name")],
    ["Email", data.get("email")],
    ["Business", data.get("business")],
    ["What I need", data.get("service")],
    ["Estimate", data.get("estimate")],
  ]
    .filter(([, value]) => value !== null)
    .map(([label, value]) => `${label}: ${value || "Not specified"}`);

  const body = [...lines, "", `${data.get("project") ?? ""}`].join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Project inquiry from ${data.get("name")}`,
  )}&body=${encodeURIComponent(body)}`;
}
