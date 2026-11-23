import Image from "next/image";
import Typography from "@/components/ui/typography";

// Each step of the form has its own person on the teal arc (Figma)
const heroImages = [
  { src: "/img/register/register-hero-1.png", alt: "A smiling student holding a laptop" },
  { src: "/img/register/register-hero-2.png", alt: "A student opening a laptop" },
  { src: "/img/register/register-hero-3.png", alt: "A smiling student holding a laptop" },
];

// The sage hero at the top of the registration form. First section on the page, so it slides
// up behind the transparent header like the other heroes. Laptop+: text left, the photo on its
// teal arc pinned to the bottom-right corner (Figma: 759×592). Phones/tablets: the photo sits
// under the text, flush with the right edge.
export default function RegisterHero({ step }: { step: number }) {
  const image = heroImages[Math.min(step, heroImages.length) - 1];

  return (
    <section className="relative overflow-hidden bg-secondary-accent">
      <div className="page-container relative z-10 flex flex-col items-start gap-4 pt-10 md:gap-5 lg:min-h-148 lg:pt-20 lg:pb-21.5">
        <Typography variant="primaryButton" as="p" className="text-light-teal">
          Learn. Build. Grow
        </Typography>

        <span className="rounded-[0.625rem] bg-primary-brand px-5 py-2.5">
          <Typography variant="body" as="span" className="text-cards-and-sections">
            Admission is open
          </Typography>
        </span>

        <Typography variant="hero" as="h1" className="mt-2 text-text-charcoal lg:max-w-128">
          Start your{" "}
          <Typography variant="span-header" className="text-light-teal">
            Learning
          </Typography>{" "}
          journey
        </Typography>

        <Typography
          variant="subHeading"
          as="p"
          className="max-w-xl font-medium text-black lg:max-w-160.5"
        >
          Build practical skills. Develop your confidence. Prepare for opportunities in Tech.
        </Typography>
      </div>

      {/* Laptop+: from the header line (the section runs up behind the header) to the bottom,
          never taller than the photos' own 592px so they aren't stretched and blurred */}
      <div className="relative ml-auto aspect-759/592 w-[min(100%,30rem)] lg:absolute lg:right-0 lg:bottom-0 lg:h-[calc(100%-var(--header-h))] lg:max-h-[592px] lg:w-auto">
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority
          // The original file, not a re-compressed copy (these are only 759px wide)
          unoptimized
          className="object-contain object-right-bottom"
        />
      </div>
    </section>
  );
}
