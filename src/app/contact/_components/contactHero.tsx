import Typography, { variantStyles } from "@/components/ui/typography";
import { DarkArrowRightUp } from "@/components/ui/reusable/svg";
import { CONTACT_EMAIL } from "@/components/ui/reusable/inquiry";
import SocialLinks from "@/components/ui/reusable/socialLinks";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";
import ContactForm from "./contactForm";

const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.country}`;

const details = [
  { label: "WHAT WE DO", text: "Businesses · Startups · Personal brands" },
  { label: "WHO WE WORK WITH", text: "Businesses · Startups · Personal brands" },
];

// Contact page hero: intro + details on the left, the inquiry form card on the right.
// First section on the page, so it sits behind the transparent header (Figma: Soft Sage 40%).
export default function ContactHero() {
  return (
    <section id="contact" className="bg-secondary-accent/40">
      {/* Spacing on the inner box (the section's top padding is the header offset).
          Figma: content 96px below the header line. */}
      <div className="mx-auto page-container flex flex-col items-start gap-10 pt-10 pb-16 lg:flex-row lg:justify-between lg:gap-3.5 lg:pt-24 lg:pb-24">
        {/* Left: stacked above the form below lg, beside it on laptop+ */}
        <div className="flex w-full flex-col items-start gap-6 lg:min-w-0 lg:flex-1 lg:max-w-152.75">
          <div className="flex flex-col items-start gap-5 md:gap-6">
            <Typography variant="text" as="p" className="uppercase text-text-charcoal">
              OUR PROCESS · HOW WE WORK
            </Typography>
            <Typography variant="hero" className="text-primary-brand lg:max-w-127.5">
              Let&apos;s create something{" "}
              <Typography variant="span-header" className="text-light-teal">
                meaningful.
              </Typography>
            </Typography>
            <Typography
              variant="largeBody"
              as="p"
              className="max-w-xl text-primary-brand lg:max-w-none"
            >
              Have a project in mind, need a clearer digital direction, or want
              to improve your online presence? Tell us a little about it and
              let&apos;s start a conversation.
            </Typography>
          </div>

          {/* Details list: sage line under each, 20px top/bottom (Figma) */}
          <ul className="w-full max-w-xl lg:max-w-147.5">
            <li className="flex flex-col items-start gap-1 border-b border-secondary-accent py-5 lg:gap-3">
              <Typography variant="primaryButton" as="p" className="text-primary-brand">
                EMAIL
              </Typography>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={cn(
                  "group inline-flex items-center gap-2 py-3 text-primary-brand",
                  variantStyles.primaryButton,
                )}
              >
                <span className="underline-offset-4 group-hover:underline">
                  {CONTACT_EMAIL}
                </span>
                <DarkArrowRightUp />
              </a>
            </li>
            <li className="flex flex-col items-start gap-1 border-b border-secondary-accent py-5 lg:gap-3">
              <Typography variant="primaryButton" as="p" className="text-primary-brand">
                PHONE
              </Typography>
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className={cn(
                  "group inline-flex items-center gap-2 py-3 text-primary-brand",
                  variantStyles.primaryButton,
                )}
              >
                <span className="underline-offset-4 group-hover:underline">
                  {siteConfig.phone.display}
                </span>
                <DarkArrowRightUp />
              </a>
            </li>
            <li className="flex flex-col items-start gap-2 border-b border-secondary-accent py-5 lg:gap-3">
              <Typography variant="primaryButton" as="p" className="text-primary-brand">
                VISIT US
              </Typography>
              {/* Opens Google Maps (the app on phones) with a pin on the office */}
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${fullAddress} in Google Maps`}
                className="group inline-flex items-start gap-2 text-text-charcoal"
              >
                <Typography
                  variant="text"
                  as="address"
                  className="not-italic underline-offset-4 group-hover:underline"
                >
                  {fullAddress}
                </Typography>
                <span className="shrink-0 [&>svg]:size-5">
                  <DarkArrowRightUp />
                </span>
              </a>
            </li>
            {details.map((detail) => (
              <li
                key={detail.label}
                className="flex flex-col items-start gap-2 border-b border-secondary-accent py-5 lg:gap-3"
              >
                <Typography variant="primaryButton" as="p" className="text-primary-brand">
                  {detail.label}
                </Typography>
                <Typography variant="text" as="p" className="text-text-charcoal">
                  {detail.text}
                </Typography>
              </li>
            ))}
            {/* Figma: label, then the icons 12px below */}
            <li className="flex flex-col items-start gap-3 border-b border-secondary-accent py-5">
              <Typography variant="primaryButton" as="p" className="text-primary-brand">
                FOLLOW US ON SOCIAL MEDIA
              </Typography>
              <SocialLinks className="text-primary-brand" />
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
