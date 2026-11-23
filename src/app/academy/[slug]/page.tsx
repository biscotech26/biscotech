import { notFound } from "next/navigation";
import BeforeFooterAction from "@/components/ui/reusable/beforeFooterAction";
import JsonLd from "@/components/ui/reusable/jsonLd";
import Typography from "@/components/ui/typography";
import { courseOffer, courses, getCourse, type Course } from "@/lib/courses";
import { organizationRef, pageJsonLd, pageMetadata, siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";
import CourseHero from "./_components/courseHero";
import CourseSectionView from "./_components/courseSections";
import { emphasisParts } from "./_components/emphasis";

// One template for every course: /academy/product-design, /academy/front-end-development...
// Content comes from src/lib/courses.tsx. All pages are built ahead of time (static),
// and any other /academy/<something> is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

// The green card's heading props from a "Plain *italic* plain *italic*" title
function ctaTitleParts(title: string) {
  const [before, highlight = "", after = "", highlightAfter] = emphasisParts(title);
  return { title: before.trim(), highlight, titleAfter: after.trim(), highlightAfter };
}

// The hero intro when it fits in a search result (160 characters), else the shorter card text
function seoDescription(course: Course) {
  const intro = course.details?.intro;
  return intro && intro.length <= 160 ? intro : course.description;
}

export async function generateMetadata({ params }: PageProps<"/academy/[slug]">) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return pageMetadata({
    title: `${course.title} Course`,
    description: seoDescription(course),
    path: `/academy/${course.slug}`,
  });
}

export default async function CoursePage({ params }: PageProps<"/academy/[slug]">) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const { details } = course;

  // Structured data so search engines can show the course details and breadcrumb
  const path = `/academy/${course.slug}`;
  const description = seoDescription(course);
  const expect = details?.sections.find((section) => section.type === "expect");
  const jsonLd = pageJsonLd({
    name: course.title,
    description,
    path,
    parents: [{ name: "Academy", path: "/academy" }],
    extra: [
      {
        "@type": "Course",
        name: course.title,
        description,
        url: `${siteConfig.url}${path}`,
        inLanguage: "en",
        provider: organizationRef,
        ...courseOffer(course),
        ...(expect && { teaches: expect.learn }),
      },
    ],
  });

  return (
    <>
      <CourseHero course={course} />

      {details ? (
        // Keyed by type and position: Figma repeats some headings within a page
        details.sections.map((section, index) => (
          <CourseSectionView key={`${section.type}-${index}`} section={section} />
        ))
      ) : (
        // Courses without a full package yet
        <section className="bg-main-background pt-14 md:pt-20 lg:pt-24">
          <div className="page-container flex flex-col items-center gap-3 text-center md:gap-4.5">
            <Typography variant="navigation" as="p" className="text-primary-brand">
              THE LEARNING EXPERIENCE
            </Typography>
            <Typography variant="section" className="max-w-xl text-primary-brand">
              Full course package{" "}
              <Typography variant="span-newsreader">coming soon.</Typography>
            </Typography>
            <Typography variant="body" className="max-w-xl text-text-charcoal">
              We&apos;re finalising the curriculum, projects and schedule for this course.
              Register your interest and we&apos;ll share the details as soon as they&apos;re ready.
            </Typography>
          </div>
        </section>
      )}

      <section
        className={cn(
          "bg-main-background py-14 md:py-20 lg:py-24",
          details?.closeFooter && "lg:pb-6.75",
        )}
      >
        {details ? (
          <BeforeFooterAction
            label={details.cta.label}
            {...ctaTitleParts(details.cta.title)}
            description={details.cta.description}
            // "Register course" opens the registration form with this course already chosen
            action={{ label: details.cta.action, href: `/academy/register?course=${course.slug}` }}
          />
        ) : (
          // Courses without a full package yet
          <BeforeFooterAction
            label="READY WHEN YOU ARE"
            title="Your next skill could open a"
            highlight="new door."
            titleAfter=""
            description={`Have a question about ${course.title}, or want to save your spot? Tell us a little about yourself and we'll take it from there.`}
            action={{ label: "Register your interest", href: `/academy/register?course=${course.slug}` }}
          />
        )}
      </section>

      <JsonLd data={jsonLd} />
    </>
  );
}
