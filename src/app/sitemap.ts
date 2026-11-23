import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { courses } from "@/lib/courses";

// /sitemap.xml — tells Google which pages exist. Add new pages here as they're built.
const routes = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.9 },
  { path: "/academy", priority: 0.8 },
  // The registration form (its checkout and invoice steps stay out of search)
  { path: "/academy/register", priority: 0.7 },
  { path: "/about", priority: 0.8 },
  { path: "/our_process", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  // One page per course, from src/lib/courses.tsx
  ...courses.map((course) => ({ path: `/academy/${course.slug}`, priority: 0.7 })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
