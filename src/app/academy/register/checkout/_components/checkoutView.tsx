"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { ArrowUpEnd } from "@/components/ui/reusable/svg";
import { formatNaira, trainingModes } from "@/lib/courses/fees";
import {
  isComplete,
  loadRegistration,
  newInvoiceNumber,
  ONLINE_PAYMENT_SOON,
  paymentOptions,
  saveRegistration,
  type Registration,
} from "@/lib/registration";
import { cn } from "@/lib/utils";
import type { CourseOption } from "../../_components/registerFlow";
import { RadioMark, TextField } from "../../_components/formParts";
import { CapIcon, CardIcon, ShieldIcon } from "../../_components/registerIcons";

// Figma's checkout ("Complete your payment"). Online payment and bank transfer aren't live yet,
// so they show a "coming soon" message; paying at the academy creates an invoice to download
// and bring along.
export default function CheckoutView({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const [data, setData] = useState<Registration | null>(null);
  const [checked, setChecked] = useState(false);
  const [toast, setToast] = useState("");
  // Name on the payment; starts as the student's name but can differ (e.g. a parent paying)
  const [billingName, setBillingName] = useState("");

  // The answers from the registration form; without them there's nothing to check out
  useEffect(() => {
    const saved = loadRegistration();
    // Browser storage can only be read after hydration, or the server and browser HTML differ
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(isComplete(saved) ? saved : null);
    if (saved) setBillingName(saved.billingName ?? `${saved.firstName} ${saved.lastName}`);
    setChecked(true);
  }, []);

  // Hide the toast after a few seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!checked) return <section className="min-h-[60vh] bg-main-background" />;

  const course = data && courses.find((c) => c.slug === data.courseSlug);
  if (!data || !course || !data.mode) {
    return (
      <section className="bg-main-background">
        <div className="page-container flex flex-col items-start gap-5 pt-14 pb-20 lg:pt-24">
          <Typography variant="section" className="text-primary-brand">
            Your registration <Typography variant="span-newsreader">isn&apos;t complete yet.</Typography>
          </Typography>
          <Typography variant="body" className="max-w-xl text-text-charcoal">
            Fill in the registration form first, then come back here to complete your payment.
          </Typography>
          <Button href="/academy/register" icon={<ArrowUpEnd />} className="border-0 bg-primary-brand text-cards-and-sections">
            Go to registration
          </Button>
        </div>
      </section>
    );
  }

  const fee = course.fees[data.mode];
  const modeLabel = trainingModes.find((m) => m.id === data.mode)?.label ?? "";
  const payAtAcademy = data.payment === "academy";

  const update = (fields: Partial<Registration>) => setData({ ...data, ...fields });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity() || !data) return;
    if (!payAtAcademy) {
      setToast(ONLINE_PAYMENT_SOON);
      return;
    }
    // Keep the same invoice if they come back and generate it again
    const invoice = data.invoice ?? { number: newInvoiceNumber(), issuedAt: new Date().toISOString() };
    saveRegistration({ ...data, billingName: billingName.trim(), invoice });
    router.push("/academy/register/invoice");
  }

  return (
    <section className="bg-main-background">
      {/* Spacing on the inner box: the first section's own top padding clears the header (globals.css) */}
      <form onSubmit={onSubmit} className="page-container flex flex-col gap-8 pt-10 pb-16 md:gap-10 lg:pt-16 lg:pb-26">
        <div className="flex flex-col items-start gap-5 md:gap-6">
          <span className="rounded-[0.625rem] bg-light-teal px-5 py-3">
            <Typography variant="primaryButton" as="span" className="text-cards-and-sections">
              Final step. Checkout
            </Typography>
          </span>
          <Typography variant="section" as="h1" className="text-primary-brand">
            Complete your payment.
          </Typography>
          <Typography variant="body" className="text-primary-brand">
            You&apos;re almost there! Review your order and choose how you&apos;d like to complete your payment.
          </Typography>
        </div>

        {/* Order summary (Figma: sage panel, 10px corners) */}
        <div className="flex flex-col rounded-[0.625rem] bg-secondary-accent px-5 py-6 md:px-6 md:py-12">
          <div className="flex items-start gap-4 border-b border-cards-and-sections/70 pb-4 md:gap-8">
            <CapIcon className="mt-9 size-7 shrink-0 text-primary-brand" />
            <div className="flex flex-col gap-1.5">
              <Typography variant="cardHeading" as="p" className="font-normal text-light-teal">
                Your order summary
              </Typography>
              <Typography variant="subHeading" as="h2" className="font-normal text-primary-brand">
                {course.title}
              </Typography>
              <Typography variant="body" as="p" className="text-primary-brand">
                {modeLabel} · {course.duration}
              </Typography>
            </div>
          </div>
          <dl className="flex flex-col gap-3 border-b border-cards-and-sections/70 py-5">
            <SummaryRow label="Course fee" value={formatNaira(fee)} />
            <SummaryRow label="Additional charges" value={formatNaira(0)} />
          </dl>
          <dl className="pt-5">
            <SummaryRow label="Total payable" value={formatNaira(fee)} />
          </dl>
        </div>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4">
            <Typography variant="subHeading" as="span" className="font-normal text-primary-brand">
              Choose payment option
            </Typography>
          </legend>
          {paymentOptions.map((option) => {
            const selected = data.payment === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-[0.625rem] border px-5 py-5 transition-colors duration-300 md:px-8",
                  selected ? "border-primary-brand" : "border-secondary-accent hover:border-light-teal/60",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.id}
                  checked={selected}
                  onChange={() => {
                    update({ payment: option.id });
                    if (option.id !== "academy") setToast(ONLINE_PAYMENT_SOON);
                  }}
                  className="sr-only"
                />
                <RadioMark checked={selected} />
                <span className="flex flex-1 flex-col gap-2.5">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <Typography variant="cardHeading" as="span" className="font-normal text-primary-brand">
                      {option.label}
                    </Typography>
                    {option.id !== "academy" && (
                      <span className="rounded-full bg-secondary-accent px-5 py-1.5">
                        <Typography variant="text" as="span" className="text-text-charcoal">
                          Coming soon
                        </Typography>
                      </span>
                    )}
                  </span>
                  {"detail" in option && (
                    <span className="flex items-center gap-3 text-light-teal">
                      <CardIcon />
                      <Typography variant="body" as="span" className="text-primary-brand">
                        {option.detail}
                      </Typography>
                    </span>
                  )}
                  <Typography variant="body" as="span" className="text-primary-brand">
                    {option.description}
                  </Typography>
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="flex flex-col gap-6 border-t border-secondary-accent pt-10 md:pt-14">
          <Typography variant="subHeading" as="h2" className="font-normal text-primary-brand">
            Billing information
          </Typography>
          <TextField
            id="billingName"
            label="Full name"
            placeholder="Name on payment"
            autoComplete="name"
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
          />
          <TextField
            id="billingEmail"
            type="email"
            label="Email address"
            placeholder="Your email address"
            autoComplete="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
          />
          <TextField
            id="billingPhone"
            type="tel"
            label="Phone number"
            placeholder="+234…"
            autoComplete="tel"
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>

        <div className="flex items-start gap-4 rounded-md bg-secondary-accent px-4 py-4 md:px-6">
          <ShieldIcon className="size-6 shrink-0 text-light-teal" />
          <div className="flex flex-col gap-2">
            <Typography variant="cardHeading" as="p" className="font-normal text-text-charcoal">
              {payAtAcademy ? "Pay in person" : "Safe and secure payment"}
            </Typography>
            <Typography variant="text" as="p" className="text-text-charcoal">
              {payAtAcademy
                ? "We'll create an invoice with your details. Download it and bring it to the academy to make your payment."
                : "Your card details are handled by our payment provider. BiscoTech does not store your card information."}
            </Typography>
          </div>
        </div>

        <Button type="submit" icon={<ArrowUpEnd />} className="w-full border-0 bg-primary-brand text-cards-and-sections">
          {payAtAcademy ? "Generate invoice" : `Pay ${formatNaira(fee)}`}
        </Button>
      </form>

      {/* "Coming soon" message for the payment methods that aren't connected yet */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "fixed inset-x-4 bottom-6 z-50 mx-auto max-w-md rounded-[0.625rem] bg-primary-brand px-5 py-4 text-cards-and-sections shadow-[0_1rem_2rem_-0.75rem_rgba(18,63,58,0.6)] transition-[opacity,translate] duration-300",
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <Typography variant="body" as="p">
          {toast || " "}
        </Typography>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt>
        <Typography variant="body" as="span" className="text-text-charcoal">
          {label}
        </Typography>
      </dt>
      <dd>
        <Typography variant="subHeading" as="span" className="font-normal text-primary-brand">
          {value}
        </Typography>
      </dd>
    </div>
  );
}
