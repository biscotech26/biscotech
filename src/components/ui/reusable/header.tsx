import Image from "next/image";
import Link from "next/link";
import NavLink, { HeaderRow, MobileMenu } from "./nav";
import Button from "../button";
import { ArrowUpEnd } from "./svg";
import HeaderOffset from "./headeroffset";
import { courses } from "@/lib/courses";

// Just the names and links for the Academy menus, so the course data stays on the server
const navCourses = courses.map(({ slug, title }) => ({ slug, title }));

export default function Header() {
  return (
    // Sticky. At the top of the page it's transparent, showing the hero behind it
    // (see HeaderOffset / globals.css). Once scrolled (data-scrolled="true") it turns solid
    // in the page hero's colour: the hero's (often semi-transparent) colour from --hero-bg
    // layered over the cream page colour — exactly how the hero itself looks.
    // Tighter padding on phones; Figma spacing from md.
    <header
      data-site-header
      className="sticky top-0 z-40 mx-auto w-full print:hidden border-b border-[#000000] bg-transparent py-3 transition-[background-color,box-shadow] duration-300 data-[scrolled=true]:bg-main-background data-[scrolled=true]:bg-[linear-gradient(var(--hero-bg,transparent),var(--hero-bg,transparent))] data-[scrolled=true]:shadow-sm md:pt-4.75 md:pb-7"
    >
      <HeaderOffset />
      {/* Course pages swap this for their simpler logo + "Back to Academy" row */}
      <HeaderRow courseSlugs={courses.map((course) => course.slug)}>
        {/* Figma: logo, nav and button with equal gaps between them (not a centred nav) */}
        <div className="relative border border-[rgba(18,63,58,0.4)] page-container mx-auto flex justify-between items-center gap-6 py-3 px-3 xl:py-5">
          {/* Header Logo */}
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

          {/* header links (desktop) */}
          <NavLink courses={navCourses} />

          <div className="flex items-center gap-2">
            {/* cn (tailwind-merge) so "hidden" replaces the base "inline-flex" instead of fighting it */}
            <Button
              href="/#contact"
              icon={<ArrowUpEnd />}
              className="shrink-0 border-0 bg-primary-brand text-cards-and-sections hidden sm:inline-flex"
            >
              Let&apos;s Talk
            </Button>
            <MobileMenu courses={navCourses} />
          </div>
        </div>
      </HeaderRow>
    </header>
  );
}
