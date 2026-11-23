import Image from "next/image";
import Link from "next/link";
import Typography from "../typography";
import { FooterRow } from "./nav";
import { courses } from "@/lib/courses";
import SocialLinks from "./socialLinks";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/academy", label: "Academy" },
];

export default function Footer() {
  return (
    // Course pages swap this for their small copyright row
    <FooterRow courseSlugs={courses.map((course) => course.slug)}>
    <footer className="bg-primary-brand pt-8 pb-4 text-cards-and-sections md:pt-10.25 md:pb-4.5 print:hidden">
      <div className="mx-auto page-container">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          {/* Logo on a white tile (smaller on phones) */}
          <Link
            href="/"
            aria-label="BiscoTech home"
            className="flex h-15 w-16 shrink-0 items-center justify-center rounded-2xl bg-cards-and-sections md:h-20 md:w-21.5 md:rounded-[1.25rem]"
          >
            <Image
              src="/img/Logo.svg"
              alt="BiscoTech"
              width={60}
              height={71}
              className="h-auto w-11 md:w-15"
            />
          </Link>

          {/* Phones: one link per line, in a single left-aligned column.
              md+: Figma's row beside the logo */}
          <nav
            aria-label="Footer"
            className="flex flex-col items-start md:flex-row md:items-center md:gap-x-8.5"
          >
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative py-2 whitespace-nowrap after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 md:p-2.5 md:after:inset-x-2.5"
              >
                {/* 14px on phones, Figma's 20px from lg */}
                <Typography
                  variant="cardHeading"
                  as="span"
                  className="text-sm leading-5 md:text-base lg:text-xl lg:leading-7"
                >
                  {label}
                </Typography>
              </Link>
            ))}
          </nav>
        </div>

        {/* Phones: social icons on their own line, then the two texts side by side in equal
            halves (may wrap onto two lines). md+: Figma's row, icons in the middle. */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-t border-secondary-accent pt-3 md:mt-28.75 md:flex-nowrap md:items-center md:gap-2 md:pt-6.5">
          <Typography
            variant="contactHeader"
            as="p"
            className="flex-1 text-[0.6875rem] leading-4 md:flex-1 md:p-2.5 md:text-sm lg:text-base lg:leading-7"
          >
            Startups · Businesses · Personal brands
          </Typography>

          <SocialLinks className="order-first w-full md:order-none md:w-auto md:justify-center" />

          <Typography
            variant="contactHeader"
            as="p"
            className="flex-1 text-[0.6875rem] leading-4 md:flex-1 md:p-2.5 md:text-right md:text-sm lg:text-base lg:leading-7"
          >
            Thoughtful digital. Meaningful growth.
          </Typography>
        </div>
      </div>
    </footer>
    </FooterRow>
  );
}
