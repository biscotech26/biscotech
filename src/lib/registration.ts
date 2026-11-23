import type { TrainingMode } from "@/lib/courses/fees";

// The course registration flow (/academy/register → checkout → invoice). There's no backend
// yet, so the answers are kept in the visitor's browser for this tab (sessionStorage) as they
// move between the pages.

export const experienceLevels = [
  { id: "beginner", label: "Beginner", description: "I am completely new" },
  { id: "intermediate", label: "Intermediate", description: "I have some experience" },
  { id: "advanced", label: "Advanced", description: "I want to improve my skills" },
] as const;

export type ExperienceLevel = (typeof experienceLevels)[number]["id"];

/** Online payment and bank transfer aren't live yet; paying at the academy makes an invoice */
export const paymentOptions = [
  {
    id: "online",
    label: "Online payment",
    description: "Pay using your debit or credit card through our secure payment gateway.",
    detail: "Visa. Mastercard. Verve",
    badge: "Secured",
  },
  {
    id: "bank",
    label: "Bank transfer",
    description: "Transfer through supported bank payment options.",
  },
  {
    id: "academy",
    label: "Pay at the academy",
    description:
      "Visit our physical location to make your payment. Enrolment remains pending until verified.",
  },
] as const;

export type PaymentOption = (typeof paymentOptions)[number]["id"];

/** Shown when someone picks a payment method that isn't connected yet */
export const ONLINE_PAYMENT_SOON =
  "Online payment is coming soon. For now, choose Pay at the academy to get your invoice.";

export type Registration = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  courseSlug: string;
  experience: ExperienceLevel | "";
  mode: TrainingMode | "";
  /** How they'd like to pay (chosen on the review step, can be changed at checkout) */
  payment: PaymentOption;
  /** Name on the payment, from checkout (defaults to the student's name) */
  billingName?: string;
  /** Set when the visitor chooses to pay at the academy */
  invoice?: { number: string; issuedAt: string };
};

export const emptyRegistration: Registration = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "Nigeria",
  courseSlug: "",
  experience: "",
  mode: "",
  payment: "online",
};

const STORAGE_KEY = "biscotech-registration";

export function loadRegistration(): Registration | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyRegistration, ...(JSON.parse(saved) as Registration) } : null;
  } catch {
    return null;
  }
}

export function saveRegistration(registration: Registration) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(registration));
  } catch {
    // Storage blocked: the flow still works on the current page
  }
}

/** True when every step of the form has been filled in */
export function isComplete(r: Registration | null): r is Registration {
  return Boolean(
    r && r.firstName && r.lastName && r.email && r.phone && r.country && r.courseSlug && r.experience && r.mode,
  );
}

/** "BTA-INV-20261123-4821": the date plus four random digits */
export function newInvoiceNumber(date = new Date()) {
  const day = date.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BTA-INV-${day}-${random}`;
}
