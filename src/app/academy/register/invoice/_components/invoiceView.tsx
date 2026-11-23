"use client";
import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { ArrowUpEnd, ChevronDown } from "@/components/ui/reusable/svg";
import { formatNaira, trainingModes } from "@/lib/courses/fees";
import { experienceLevels, loadRegistration, type Registration } from "@/lib/registration";
import { cn } from "@/lib/utils";
import type { CourseOption } from "../../_components/registerFlow";
import { CardIcon, CheckIcon, LaptopIcon, MailIcon } from "../../_components/registerIcons";
import { downloadInvoice, type InvoiceFormat } from "./invoiceFile";

type Academy = { address: string; phone: string; email: string };

// The invoice for paying at the academy (built on Figma's "Payment successful" page).
// "Download invoice" saves it straight to the device as a PDF, JPEG or PNG (drawn in the
// browser, invoiceFile.ts). "Print" uses the browser's print dialog: the print version drops
// the site's header, footer and buttons, adds BiscoTech's details at the top and puts
// "What next?" on a second page.
export default function InvoiceView({ courses, academy }: { courses: CourseOption[]; academy: Academy }) {
  const [data, setData] = useState<Registration | null>(null);
  const [checked, setChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Browser storage can only be read after hydration, or the server and browser HTML differ
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadRegistration());
    setChecked(true);
  }, []);

  if (!checked) return <section className="min-h-[60vh] bg-main-background" />;

  const course = data && courses.find((c) => c.slug === data.courseSlug);
  if (!data?.invoice || !course || !data.mode) {
    return (
      <section className="bg-main-background">
        <div className="page-container flex flex-col items-start gap-5 pt-14 pb-20 lg:pt-24">
          <Typography variant="section" className="text-primary-brand">
            No invoice <Typography variant="span-newsreader">yet.</Typography>
          </Typography>
          <Typography variant="body" className="max-w-xl text-text-charcoal">
            Register for a course and choose &quot;Pay at the academy&quot; at checkout to get your invoice.
          </Typography>
          <Button href="/academy/register" icon={<ArrowUpEnd />} className="border-0 bg-primary-brand text-cards-and-sections">
            Go to registration
          </Button>
        </div>
      </section>
    );
  }

  const fee = course.fees[data.mode];
  const issued = new Date(data.invoice.issuedAt).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const studentName = `${data.firstName} ${data.lastName}`;

  // The details, shared by the page and the downloaded file
  const rows: [string, string][] = [
    ["Invoice number", data.invoice.number],
    ["Date issued", issued],
    ["Student", studentName],
    ...(data.billingName && data.billingName !== studentName
      ? ([["Paid by", data.billingName]] as [string, string][])
      : []),
    ["Email", data.email],
    ["Phone", data.phone],
    ["Programme", course.title],
    ["Training type", trainingModes.find((m) => m.id === data.mode)?.label ?? ""],
    ["Duration", course.duration],
    ["Experience level", experienceLevels.find((l) => l.id === data.experience)?.label ?? ""],
    ["Payment method", "Pay at the academy"],
    ["Payment status", "Pending"],
  ];
  const nextSteps = [
    `Bring this invoice to the academy at ${academy.address} to make your payment.`,
    "Once your payment is verified, we'll confirm your registration and share your class timetable.",
    "Remember to bring your personal laptop to class.",
  ];
  const contactLine = `Questions? Call or WhatsApp ${academy.phone} or email ${academy.email}.`;

  async function download(format: InvoiceFormat) {
    setMenuOpen(false);
    setBusy(true);
    try {
      await downloadInvoice(
        { number: data!.invoice!.number, issued, amount: formatNaira(fee), rows, nextSteps, contactLine, academy },
        format,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-main-background print:p-0">
      {/* Spacing on the inner box: the first section's own top padding clears the header (globals.css) */}
      <div className="page-container flex flex-col gap-8 pt-10 pb-16 md:gap-12 lg:pt-16 lg:pb-24 print:max-w-none print:gap-6 print:px-0 print:pt-0">
        {/* Print only: who the invoice is from */}
        <div className="hidden items-start justify-between gap-6 border-b border-secondary-accent pb-5 print:flex">
          {/* A real image (230×271): Logo.svg wraps a bitmap, which prints blurry */}
          <Image src="/img/logo-mark.png" alt="BiscoTech" width={230} height={271} unoptimized className="h-auto w-14" />
          <div className="text-right text-sm text-text-charcoal">
            <p className="font-semibold text-primary-brand">BiscoTech Academy</p>
            <p>{academy.address}</p>
            <p>
              {academy.phone} · {academy.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center md:gap-5">
          <span className="flex size-20 items-center justify-center rounded-full bg-secondary-accent text-light-teal md:size-25 print:hidden">
            <CheckIcon className="size-10 md:size-12" />
          </span>
          <span className="rounded-md bg-secondary-accent px-3 py-1.5">
            <Typography variant="primaryButton" as="span" className="text-[#9A6A12]">
              Payment pending
            </Typography>
          </span>
          <Typography variant="section" as="h1" className="text-primary-brand">
            Your invoice is ready
          </Typography>
          <Typography variant="body" className="max-w-2xl text-primary-brand">
            Thank you for choosing BiscoTech Academy. Download this invoice and bring it to the
            academy to make your payment. Your enrolment is confirmed once payment is verified.
          </Typography>
        </div>

        {/* Amount and details (Figma: sage panel) */}
        <div className="flex flex-col rounded-[0.625rem] bg-secondary-accent px-5 py-8 md:px-6 md:py-14 print:border print:border-secondary-accent print:bg-transparent">
          <div className="flex flex-col gap-1 border-b border-cards-and-sections pb-4 print:border-secondary-accent">
            <Typography variant="cardHeading" as="p" className="font-normal text-text-charcoal">
              AMOUNT DUE
            </Typography>
            <Typography variant="subHeading" as="p" className="font-normal text-text-charcoal">
              {formatNaira(fee)}
            </Typography>
          </div>
          <dl className="flex flex-col gap-3.5 pt-5">
            {rows.map(([label, value]) => (
              <Row
                key={label}
                label={label}
                value={
                  label === "Payment status" ? (
                    <span className="rounded-md bg-cards-and-sections px-2 py-0.5 text-[#9A6A12]">{value}</span>
                  ) : (
                    value
                  )
                }
              />
            ))}
          </dl>
        </div>

        {/* Printed on a page of its own, after the invoice */}
        <div className="flex flex-col gap-5 rounded-[0.625rem] bg-secondary-accent px-5 py-8 md:px-6 md:py-14 print:break-before-page print:border print:border-secondary-accent print:bg-transparent">
          <Typography variant="cardHeading" as="h2" className="font-normal text-text-charcoal">
            What next?
          </Typography>
          <ul className="flex flex-col gap-3">
            {nextSteps.map((step, index) => (
              <NextStep key={step} icon={[<CardIcon key="c" className="size-5" />, <MailIcon key="m" className="size-5" />, <LaptopIcon key="l" className="size-5" />][index]}>
                {step}
              </NextStep>
            ))}
          </ul>
          <Typography variant="text" as="p" className="text-text-charcoal">
            {contactLine}
          </Typography>
        </div>

        {/* Download (as a PDF or picture, straight to the device), print, or go back */}
        <div className="flex flex-col gap-3 sm:flex-row print:hidden">
          <div className="relative flex-1">
            <Button
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              disabled={busy}
              icon={<ChevronDown className={cn("size-5 transition-transform duration-300", menuOpen && "rotate-180")} />}
              className="w-full border-0 bg-primary-brand text-cards-and-sections disabled:opacity-70"
            >
              {busy ? "Preparing…" : "Download invoice"}
            </Button>
            {menuOpen && (
              <ul
                role="menu"
                className="absolute inset-x-0 bottom-full z-10 mb-2 flex flex-col gap-0.5 rounded-[0.625rem] border border-secondary-accent bg-cards-and-sections p-2 shadow-lg"
              >
                {(
                  [
                    ["pdf", "PDF document"],
                    ["jpeg", "JPEG image"],
                    ["png", "PNG image"],
                  ] as [InvoiceFormat, string][]
                ).map(([format, label]) => (
                  <li key={format} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => download(format)}
                      className="w-full cursor-pointer rounded-md px-4 py-3 text-left transition-colors hover:bg-secondary-accent/60"
                    >
                      <Typography variant="primaryButton" as="span" className="text-primary-brand">
                        {label}
                      </Typography>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button
            onClick={() => window.print()}
            className="w-full flex-1 border border-primary-brand bg-transparent text-primary-brand hover:bg-primary-brand hover:text-cards-and-sections"
          >
            Print
          </Button>
          <Button
            href="/academy"
            icon={<ArrowUpEnd />}
            className="w-full flex-1 border border-primary-brand bg-transparent text-primary-brand hover:bg-primary-brand hover:text-cards-and-sections"
          >
            Return to academy
          </Button>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt>
        <Typography variant="body" as="span" className="text-text-charcoal">
          {label}
        </Typography>
      </dt>
      <dd className="min-w-0 text-right wrap-break-word">
        <Typography variant="body" as="span" className="text-text-charcoal">
          {value}
        </Typography>
      </dd>
    </div>
  );
}

function NextStep({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-light-teal">{icon}</span>
      <Typography variant="body" as="span" className="text-text-charcoal">
        {children}
      </Typography>
    </li>
  );
}
