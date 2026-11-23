import { courses } from "@/lib/courses";
import { pageMetadata } from "@/lib/seo";
import RegisterFlow from "./_components/registerFlow";

const description =
  "Register for a BiscoTech Academy course in Enugu: choose your course and how you'd like to learn (physical, online or executive), then complete your enrolment.";

export const metadata = pageMetadata({
  title: "Register for a Course",
  description,
  path: "/academy/register",
});

// /academy/register?course=product-design starts with that course already chosen (the course
// pages' "Register course" buttons link here that way)
export default async function RegisterPage({ searchParams }: PageProps<"/academy/register">) {
  const { course } = await searchParams;

  // Only what the form needs, so the course pages' content isn't sent to the browser
  const options = courses.map(({ slug, title, duration, fees }) => ({ slug, title, duration, fees }));

  return (
    <RegisterFlow courses={options} initialCourse={typeof course === "string" ? course : undefined} />
  );
}
