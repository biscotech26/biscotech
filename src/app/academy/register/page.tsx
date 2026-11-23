import JsonLd from "@/components/ui/reusable/jsonLd";
import { courseOffer, courses } from "@/lib/courses";
import { organizationRef, pageJsonLd, pageMetadata, siteConfig } from "@/lib/seo";
import RegisterFlow from "./_components/registerFlow";

const description =
  "Register for a BiscoTech Academy course in Enugu: choose your course and how you'd like to learn (physical, online or executive), then complete your enrolment.";

export const metadata = pageMetadata({
  title: "Register for a Course",
  description,
  path: "/academy/register",
});

// Structured data: Home › Academy › Register, and the courses you can register for here, each
// with its fees and a link to the registration form for that course
const jsonLd = pageJsonLd({
  name: "Register for a course",
  description,
  path: "/academy/register",
  parents: [{ name: "Academy", path: "/academy" }],
  extra: [
    {
      "@type": "ItemList",
      name: "Courses open for registration",
      itemListElement: courses.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course.title,
          description: course.description,
          url: `${siteConfig.url}/academy/${course.slug}`,
          provider: organizationRef,
          ...courseOffer(course),
        },
      })),
    },
  ],
});

// /academy/register?course=product-design starts with that course already chosen (the course
// pages' "Register course" buttons link here that way)
export default async function RegisterPage({ searchParams }: PageProps<"/academy/register">) {
  const { course } = await searchParams;

  // Only what the form needs, so the course pages' content isn't sent to the browser
  const options = courses.map(({ slug, title, duration, fees }) => ({ slug, title, duration, fees }));

  return (
    <>
      <RegisterFlow courses={options} initialCourse={typeof course === "string" ? course : undefined} />
      <JsonLd data={jsonLd} />
    </>
  );
}
