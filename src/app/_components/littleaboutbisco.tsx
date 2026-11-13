import Image from "next/image";
import Typography from "@/components/ui/typography";
import { NorthStar } from "@/components/ui/reusable/svg";

const values = [
  {
    title: "People before pixels",
    description: "We start with your audience, needs and goals.",
  },
  {
    title: "Clarity over clutter",
    description: "Every detail earns its place.",
  },
  {
    title: "Built with intention",
    description: "Thoughtful choices, not design for design's sake.",
  },
  {
    title: "Growth-minded",
    description: "Creative work connected to business outcomes.",
  },
];

const slides = [1, 2, 3, 4].map((n) => `/img/team_slide_${n}.jpeg`);

export default function LittleAboutBisco() {
  return (
    <section className="bg-main-background py-16 lg:py-24">
      <div className="mx-auto flex page-container flex-col gap-10 lg:gap-4.5">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-22.5">
          {/* Intro */}
          <div className="flex flex-col gap-4 md:gap-8.5 lg:w-155.75">
            <Typography variant="navigation" className="text-primary-brand">
              02 / A LITTLE ABOUT BISCO
            </Typography>
            <Typography variant="section" className="text-primary-brand">
              Good businesses deserve an{" "}
              <Typography variant="span-newsreader">exceptional</Typography>{" "}
              digital presence.
            </Typography>
            <div className="flex flex-col gap-[1.4rem] lg:w-127">
              <Typography variant="body" className="text-text-charcoal">
                BiscoTech brings design, development and digital growth
                together to help businesses show up with clarity and
                confidence. We believe great digital work should feel good to
                use, make sense for the business and give people a reason to
                take the next step.
              </Typography>
              <Typography variant="body" className="text-text-charcoal">
                Whether you&apos;re building something from scratch or ready to
                improve what you have, we start by understanding where you want
                to go.
              </Typography>
            </div>
          </div>

          {/* Values list */}
          <ul className="flex flex-col gap-0.5 lg:w-121.75 lg:shrink-0">
            {values.map((value) => (
              <li
                key={value.title}
                className="flex items-start border-b border-secondary-accent py-4 last:border-b-0"
              >
                <span className="shrink-0 [&>svg]:size-8 md:[&>svg]:size-10">
                  <NorthStar />
                </span>
                <div className="flex flex-col gap-1.5 px-2.5 pt-1 md:gap-4.25 md:p-2.5">
                  <Typography
                    variant="cardHeading"
                    as="h3"
                    className="text-primary-brand"
                  >
                    {value.title}
                  </Typography>
                  <Typography variant="body" className="text-text-charcoal">
                    {value.description}
                  </Typography>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Four photos in a row, listed twice and slid left by one copy, so they scroll
            right to left forever without a jump */}
        <div className="relative aspect-1200/658 w-full overflow-hidden rounded-sm">
          <div className="absolute inset-y-0 left-0 flex w-[800%] motion-safe:animate-marquee">
            {[...slides, ...slides].map((src, i) => (
              <div
                key={i}
                className="relative h-full w-[12.5%] shrink-0"
                aria-hidden={i >= slides.length}
              >
                <Image
                  src={src}
                  alt={i < slides.length ? `BiscoTech team photo ${i + 1}` : ""}
                  fill
                  sizes="(min-width: 1440px) 75rem, 83vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
