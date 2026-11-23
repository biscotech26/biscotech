import Image from "next/image";
import Button from "@/components/ui/button";
import { ArrowUpEnd, CheckCircle } from "@/components/ui/reusable/svg";
import Typography from "@/components/ui/typography";

const values = ["Learn with curiosity", "Build with purpose", "Growth with confidence"];

// Phones/tablets: text (left-aligned) above the photo. Laptop+: text left, photo right (Figma:
// text column 611px, photo 562×473, 28px apart, text vertically centred on the photo).
// The floating Grow/Build/Design tags are part of the image file.
export default function AcademyHero() {
  return (
    <section className="bg-main-background bg-linear-to-b from-main-background to-[rgba(18,63,58,0.2)]">
      {/* Spacing lives on the inner box: the section's own top padding is reserved for
          the header offset (globals.css). Figma: 55px below the header line, 74px below. */}
      <div className="page-container flex flex-col items-center gap-10 pt-10 pb-14 md:gap-12 lg:grid lg:grid-cols-[611fr_562fr] lg:items-center lg:gap-7 lg:pt-13.75 lg:pb-18.5">
        <div className="flex flex-col items-start gap-8 lg:gap-12">
          <div className="flex flex-col items-start gap-5 md:gap-6">
            <Typography variant="text" className="uppercase text-text-charcoal">
              BISCOTECH ACADEMY · LEARN & GROW
            </Typography>

            <Typography variant="hero" className="text-primary-brand lg:max-w-138.25">
              Learn the skills.{" "}
              <Typography variant="span-header" className="block text-light-teal">
                Build what&apos;s next.
              </Typography>
            </Typography>

            <Typography variant="largeBody" className="max-w-xl text-text-charcoal lg:max-w-none">
              Practical digital learning for curious minds, career builders, and
              business owners ready to grow their skills.
            </Typography>

            {/* Phones: full-width stacked buttons; side by side from sm */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
              <Button href="#courses" icon={<ArrowUpEnd />} className="shrink-0 border-0 bg-primary-brand text-cards-and-sections w-full sm:w-auto">
                Explore course packages
              </Button>
              {/* Opens the registration form */}
              <Button
                href="/academy/register"
                className="shrink-0 border-0 bg-primary-brand text-cards-and-sections w-full border border-primary-brand bg-transparent text-text-charcoal hover:bg-primary-brand hover:text-cards-and-sections sm:w-auto"
              >
                Register your interest
              </Button>
            </div>
          </div>

          <ul className="flex flex-wrap gap-x-5.25 gap-y-2">
            {values.map((value) => (
              <li key={value} className="flex items-center gap-1.5">
                <CheckCircle className="size-5 shrink-0 md:size-6" />
                <Typography variant="text" as="span" className="text-text-charcoal">
                  {value}
                </Typography>
              </li>
            ))}
          </ul>
        </div>

        <Image
          src="/img/academy_hero_image.png"
          alt="A smiling student learning on a tablet at BiscoTech Academy"
          width={562}
          height={473}
          priority
          sizes="(min-width: 1024px) 562px, (min-width: 640px) 576px, 100vw"
          className="h-auto w-full max-w-xl lg:max-w-none"
        />
      </div>
    </section>
  );
}
