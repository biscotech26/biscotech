import Button from "@/components/ui/button";
import StackCards from "@/components/ui/reusable/stackCards";
import { DarkArrowRightUp } from "@/components/ui/reusable/svg";
import Typography from "@/components/ui/typography";
import { courses, formatNaira, lowestFee } from "@/lib/courses";

// Soft sage section, intro on top, then the course cards: one column on phones, two
// from tablet (Figma: 588×540 white cards, 22px apart side to side, ~32px between rows).
export default function CourseCatalogue() {
  return (
    // id so the hero's "Explore course packages" button can jump here
    <section id="courses" className="bg-secondary-accent py-14 md:py-16 lg:pt-16 lg:pb-17.25">
      <div className="page-container flex flex-col gap-10 md:gap-14 lg:gap-23">
        {/* Figma: 498px wide, 18px between label, heading and text */}
        <div className="flex max-w-xl flex-col items-start gap-3 md:gap-4.5 lg:max-w-124.5">
          <Typography variant="navigation" as="p" className="text-primary-brand">
            COURSE CATALOGUE
          </Typography>

          <Typography variant="section" className="text-primary-brand lg:max-w-109">
            Choose a <Typography variant="span-newsreader">skill</Typography>.
            See what you&apos;ll{" "}
            <Typography variant="span-newsreader">learn</Typography>.
          </Typography>

          <Typography variant="body" className="text-text-charcoal">
            Explore individual learning paths and open any package to see the
            proposed curriculum, practical projects, and course details.
          </Typography>
        </div>

        <StackCards className="reveal-children grid gap-5 md:grid-cols-2 md:gap-x-5.5 md:gap-y-8">
          {courses.map((course) => (
            // Figma: 55px side padding, 41px top/bottom, ~23px between each block
            <article
              key={course.title}
              className="group card-hover flex flex-col gap-5 rounded-[0.625rem] border border-[rgba(48,55,53,0.2)] bg-cards-and-sections px-6 py-7 md:px-8 lg:gap-5.75 lg:px-13.75 lg:py-10.25"
            >
              <Typography variant="text" as="span" className="-ml-2.5 p-2.5 text-light-teal">
                {course.tag}
              </Typography>

              {/* 64px sage tile, 24px icon; the north star is gold by default so recolour its strokes */}
              <span className="flex size-14 items-center justify-center rounded-[0.625rem] bg-secondary-accent transition-transform duration-500 ease-out motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6 md:size-16 [&>svg]:size-6 [&_path[stroke]]:stroke-primary-brand">
                {course.icon}
              </span>

              <div className="flex flex-col gap-3 border-b border-[rgba(48,55,53,0.2)] pb-5 lg:gap-4.5">
                <Typography variant="subHeading" as="h3" className="font-medium text-primary-brand">
                  {course.title}
                </Typography>
                <Typography variant="body" className="text-text-charcoal">
                  {course.description}
                </Typography>
              </div>

              <div className="flex flex-col gap-3 border-b border-[rgba(48,55,53,0.2)] pb-5 lg:gap-4.5">
                <Typography variant="body" className="text-text-charcoal">
                  {course.pathway}
                </Typography>
                {/* The cheapest option (online); the course page lists all three */}
                <Typography variant="cardHeading" as="p" className="font-medium text-text-charcoal">
                  From {formatNaira(lowestFee(course))} · {course.duration}
                </Typography>
              </div>

              {/* Opens the course page (/academy/[slug]) */}
              <Button
                variant="text"
                href={`/academy/${course.slug}`}
                icon={<DarkArrowRightUp />}
                className="w-full justify-between border-0 px-0 text-primary-brand"
              >
                View course package
              </Button>
            </article>
          ))}
        </StackCards>
      </div>
    </section>
  );
}
