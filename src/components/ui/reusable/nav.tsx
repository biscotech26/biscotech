"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Typography from "../typography";
import Button from "../button";
import { usePathname } from "next/navigation";
import { ArrowUpEnd, BackArrow, ChevronDown } from "./svg";
import { cn } from "@/lib/utils";
import SocialLinks from "./socialLinks";

// Course pages (/academy/<course>) use Figma's simpler header: just the logo and a link back
// to the Academy (44px above the logo, 31px below). Every other page keeps the full header,
// passed in as children. The list of slugs means a mistyped course URL (a 404) still gets
// the full header.
export function HeaderRow({
  courseSlugs,
  children,
}: {
  courseSlugs: string[];
  children: ReactNode;
}) {
  const pathName = usePathname();
  const isCoursePage = courseSlugs.some((slug) => pathName === `/academy/${slug}`);
  // The registration pages (form, checkout, invoice) use the same simple header
  const isRegister = pathName.startsWith("/academy/register");
  if (!isCoursePage && !isRegister) return children;
  // Figma: checkout offers "Cancel" instead
  const isCheckout = pathName === "/academy/register/checkout";

  return (
    <div className="page-container flex items-start justify-between gap-6 md:pt-6.25 md:pb-0.75">
      <Link href="/" aria-label="BiscoTech home" className="shrink-0">
        <Image
          src="/img/Logo.svg"
          alt="BiscoTech"
          width={60}
          height={71}
          className="h-auto w-12 xl:w-15"
          priority
        />
      </Link>

      <Link
        href={isCheckout ? "/academy" : "/academy#courses"}
        className="group flex items-center gap-1 text-text-charcoal transition-colors hover:text-light-teal md:gap-2"
      >
        <BackArrow className="size-5 transition-[translate] duration-300 motion-safe:group-hover:-translate-x-1 md:size-6" />
        <Typography
          variant="navButton"
          as="span"
          className="py-2.5 text-sm md:text-base"
        >
          {isCheckout ? "Cancel" : "Back to Academy"}
        </Typography>
      </Link>
    </div>
  );
}

// Course pages also swap the big footer (passed in as children) for Figma's small row:
// copyright and a link back to the Academy.
export function FooterRow({
  courseSlugs,
  children,
}: {
  courseSlugs: string[];
  children: ReactNode;
}) {
  const pathName = usePathname();
  const isCoursePage = courseSlugs.some((slug) => pathName === `/academy/${slug}`);

  // Registration pages: Figma's dark footer with the logo tile, a tagline and the social icons
  if (pathName.startsWith("/academy/register")) {
    return (
      <footer className="bg-primary-brand py-8 text-cards-and-sections md:py-10 print:hidden">
        <div className="page-container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            aria-label="BiscoTech home"
            className="flex h-15 w-16 shrink-0 items-center justify-center rounded-2xl bg-cards-and-sections md:h-20 md:w-21.5 md:rounded-[1.25rem]"
          >
            <Image src="/img/Logo.svg" alt="BiscoTech" width={60} height={71} className="h-auto w-11 md:w-15" />
          </Link>
          <Typography variant="contactHeader" as="p" className="max-w-54">
            Skills today. Better opportunities tomorrow
          </Typography>
          <SocialLinks className="[&_svg]:w-7 lg:[&_svg]:w-10" />
        </div>
      </footer>
    );
  }

  if (!isCoursePage) return children;

  return (
    <footer className="bg-main-background pb-5.5 print:hidden">
      <div className="page-container flex flex-wrap items-center gap-x-0.75">
        <Typography variant="body" as="p" className="text-text-charcoal">
          &copy; {new Date().getFullYear()} BiscoTech Academy
        </Typography>
        <Button
          variant="text"
          href="/academy"
          className="rounded-none border-0 border-b border-primary-brand text-primary-brand"
        >
          Return to academy
        </Button>
      </div>
    </footer>
  );
}

export const navItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/services",
    label: "Services",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/our_process",
    label: "Our Process",
  },
  {
    href: "/academy",
    label: "Academy",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

/** What the menus need to know about each course (passed in by the server-side header) */
export type NavCourse = { slug: string; title: string };

// Desktop "Academy" item: the link plus a dropdown of every course. Opens while the mouse is
// over it or the keyboard is inside it; the arrow flips up while it's open. Closes on Escape
// and once a course is picked.
function AcademyMenu({
  courses,
  isActive,
}: {
  courses: NavCourse[];
  isActive: boolean;
}) {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <Link
        href="/academy"
        aria-haspopup="true"
        aria-expanded={open}
        className={`group relative block whitespace-nowrap p-2.5 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-primary-brand after:transition-transform after:duration-300 after:ease-out ${isActive || open ? "after:scale-x-100" : "after:scale-x-0"}`}
      >
        <Typography
          variant="navButton"
          className={isActive ? "text-primary-brand" : "text-text-charcoal"}
        >
          Academy
        </Typography>
        <ChevronDown
          className={cn(
            // Inline (not a flex row) so "Academy" lines up with the other links' text
            "ml-1 inline-block size-4 align-middle transition-transform duration-300",
            isActive ? "text-primary-brand" : "text-text-charcoal",
            open && "rotate-180",
          )}
        />
      </Link>

      {/* pt-3 is an invisible bridge, so moving the mouse down to the list doesn't close it */}
      <div
        className={cn(
          "absolute top-full left-1/2 z-50 w-72 -translate-x-1/2 pt-3 transition-[opacity,translate] duration-200",
          open ? "visible opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <ul className="flex flex-col gap-0.5 rounded-[0.625rem] border border-[rgba(18,63,58,0.2)] bg-cards-and-sections p-2 shadow-lg">
          {courses.map((course) => {
            const href = `/academy/${course.slug}`;
            return (
              <li key={course.slug}>
                <Link
                  href={href}
                  onClick={close}
                  className={cn(
                    "block rounded-[0.5rem] px-3 py-2.5 transition-colors duration-200",
                    pathName === href ? "bg-secondary-accent" : "hover:bg-secondary-accent/50",
                  )}
                >
                  <Typography variant="navButton" as="span" className="text-primary-brand">
                    {course.title}
                  </Typography>
                </Link>
              </li>
            );
          })}
          <li className="mt-1 border-t border-[rgba(18,63,58,0.15)] pt-1">
            <Link
              href="/academy#courses"
              onClick={close}
              className="flex items-center justify-between rounded-[0.5rem] px-3 py-2.5 transition-colors duration-200 hover:bg-secondary-accent/50"
            >
              <Typography variant="primaryButton" as="span" className="text-light-teal">
                View all courses
              </Typography>
              <ArrowUpEnd className="size-4 text-light-teal" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function NavLink({ courses }: { courses: NavCourse[] }) {
  const pathName = usePathname();

  const nav = navItems.map(({ href, label }) => {
    if (href === "/academy") {
      return (
        <AcademyMenu
          key={href}
          courses={courses}
          isActive={pathName === href || pathName.startsWith("/academy/")}
        />
      );
    }

    const isActive = pathName === href;
    return (
      <Link
        key={href}
        href={href}
        // Underline grows in from the left on hover; stays full under the active page
        className={`group relative p-2.5 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-primary-brand after:transition-transform after:duration-300 after:ease-out ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
      >
        {/* Figma: active link in brand teal, the rest in charcoal */}
        <Typography
          variant="navButton"
          className={isActive ? "text-primary-brand" : "text-text-charcoal"}
        >
          {label}
        </Typography>
      </Link>
    );
  });

  return <nav className="hidden xl:flex gap-2.5 items-end">{nav}</nav>;
}

// Below xl the links don't fit in one row, so they collapse into a dropdown. There's no hover
// on phones, so Academy gets an arrow button that opens its course list.
export function MobileMenu({ courses }: { courses: NavCourse[] }) {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // While open: close on a click/tap anywhere outside the menu (and its toggle), or on Escape
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex size-11 cursor-pointer items-center justify-center rounded-[0.625rem] text-primary-brand"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-50 mt-2 flex flex-col gap-1 border border-[rgba(18,63,58,0.4)] bg-main-background p-4 shadow-lg"
        >
          {navItems.map(({ href, label }) => {
            const isActive = pathName === href;
            const link = (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex-1 rounded-[0.625rem] px-3 py-3 transition-colors duration-200",
                  isActive ? "bg-secondary-accent" : "hover:bg-secondary-accent/50",
                )}
              >
                <Typography
                  variant="navButton"
                  className={isActive ? "text-primary-brand" : "text-text-charcoal"}
                >
                  {label}
                </Typography>
              </Link>
            );
            if (href !== "/academy") return link;

            return (
              <div key={href}>
                <div className="flex items-center gap-1">
                  {link}
                  <button
                    type="button"
                    onClick={() => setCoursesOpen((o) => !o)}
                    aria-expanded={coursesOpen}
                    aria-controls="mobile-menu-courses"
                    aria-label={coursesOpen ? "Hide courses" : "Show courses"}
                    className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[0.625rem] text-primary-brand hover:bg-secondary-accent/50"
                  >
                    <ChevronDown
                      className={cn("size-5 transition-transform duration-300", coursesOpen && "rotate-180")}
                    />
                  </button>
                </div>
                {coursesOpen && (
                  <ul id="mobile-menu-courses" className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-secondary-accent pl-2">
                    {courses.map((course) => {
                      const courseHref = `/academy/${course.slug}`;
                      return (
                        <li key={course.slug}>
                          <Link
                            href={courseHref}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block rounded-[0.5rem] px-3 py-2.5 transition-colors duration-200",
                              pathName === courseHref ? "bg-secondary-accent" : "hover:bg-secondary-accent/50",
                            )}
                          >
                            <Typography variant="text" as="span" className="text-primary-brand">
                              {course.title}
                            </Typography>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
          <Button
            href="/#contact"
            onClick={() => setOpen(false)}
            icon={<ArrowUpEnd />}
            className="shrink-0 border-0 bg-primary-brand text-cards-and-sections mt-2 sm:hidden"
          >
            Let&apos;s Talk
          </Button>
        </nav>
      )}
    </div>
  );
}
