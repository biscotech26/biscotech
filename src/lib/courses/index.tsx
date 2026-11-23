import type { ReactNode } from "react";
import {
  CodeIcon,
  CommandKeyIcon,
  DarkArrowRightUp,
  LayersIcon,
  NorthStar,
  SmartphoneIcon,
} from "@/components/ui/reusable/svg";
import { appDevelopment } from "./app-development";
import { siteConfig } from "@/lib/seo";
import { trainingModes, type TrainingMode } from "./fees";
import { backEnd } from "./back-end";
import { digitalMarketing } from "./digital-marketing";
import { frontEnd } from "./front-end";
import { fullStack } from "./full-stack";
import { pythonBackend } from "./python-backend";
import { productDesign } from "./product-design";

// Everything about the Academy's courses lives here. The catalogue cards (/academy), each
// course page (/academy/[slug]), the sitemap and the SEO data are all built from this list,
// so adding a course = adding one entry. No backend needed.

export { formatNaira, trainingModes, type TrainingMode } from "./fees";

/** The cheapest way to take a course, for "From ₦..." */
export function lowestFee(course: Course) {
  return Math.min(...Object.values(course.fees));
}

type SectionHeading = {
  /** Small line at the top */
  label: string;
  /** *Asterisks* mark Figma's italic words: "What should *you expect?*" */
  title: string;
  /** Paragraph under the title */
  intro: string;
};

/** Section background: "sage" is the coloured band, "cream" the page colour */
export type SectionTone = "sage" | "cream";

/** The building blocks of a course page. Each course lists the ones it uses, in order. */
export type CourseSection =
  /** Intro with "What you'll learn" and "Who this course is for" checklists. Without an
   *  audience list, the intro and the one checklist sit side by side. */
  | (SectionHeading & {
      type: "expect";
      learn: string[];
      audience?: string[];
      /** Small note under the "Who this course is for" list */
      audienceNote?: string;
    })
  /** Sage band of white module cards (the course outline) */
  | (SectionHeading & {
      type: "modules";
      modules: { label: string; title: string; description: string }[];
    })
  /** Larger curriculum cards: stage, summary, topic list and an optional project */
  | (SectionHeading & {
      type: "stages";
      tone: SectionTone;
      /** Button beside the heading */
      action?: string;
      /** Smaller topic text, for the longer curriculums */
      compact?: boolean;
      /** Lay each card's topics out in two columns */
      topicColumns?: 2;
      /** Figma's shorter cards (about 404px), for stages with no description or project */
      shortCards?: boolean;
      /** Mobile App's "Part" cards (650px): topics written "Lead: details", lead in semibold */
      partCards?: boolean;
      stages: {
        label: string;
        title: string;
        description?: string;
        topics: string[];
        /** Shown as "Practical projects: ..." in a sage box */
        project?: string;
        /** Shown as "Practical: ..." in a cream box */
        practical?: string;
        /** Fits a longer list: wider text and tighter rows, keeping the card's height */
        wide?: boolean;
        /** Rows 12px apart rather than 18px, for Figma's fullest two-column cards */
        tightTopics?: boolean;
      }[];
    })
  /** Rows of small cards, e.g. "What will you work on?" */
  | (SectionHeading & {
      type: "cards";
      tone: SectionTone;
      /** All cards the same height with their text centred, however long it is */
      sameHeight?: boolean;
      /** Card labels in light teal rather than the heading colour */
      tealLabels?: boolean;
      /** One row that scrolls sideways (Figma shows three of the cards at a time) */
      scroll?: boolean;
      cards: { label?: string; title: string; description: string }[];
    })
  /** Rounded tags, e.g. "Tools and Technologies" */
  | (SectionHeading & {
      type: "tools";
      tools: string[];
    })
  /** Sage cards with one line each, two across, e.g. "Build Skills Beyond the Code" */
  | (Omit<SectionHeading, "intro"> & {
      type: "highlights";
      items: string[];
    })
  /** Ticked lists in white cards, e.g. "More than just backend tools." */
  | (SectionHeading & {
      type: "ticks";
      lists: string[][];
    })
  /** The learning packages: white cards that turn dark teal and grow on hover */
  | (SectionHeading & {
      type: "packages";
      tone: SectionTone;
      /** Figma's smaller gap (51px, not 96px) down to the green card, on a cream section */
      closeToCta?: boolean;
      /** All three cards the same height, buttons at the bottom */
      sameHeight?: boolean;
      packages: {
        tag: string;
        title: string;
        description: string;
        features: string[];
        /** Features that stay on one line at full width, using the card's padding */
        oneLine?: string[];
        /** Button text */
        action: string;
      }[];
    });

/** One section type, e.g. SectionOf<"modules"> */
export type SectionOf<T extends CourseSection["type"]> = Extract<CourseSection, { type: T }>;

/** The course page content, kept in its own file per course. Leave it off a course and its
 *  page shows the hero plus a "full package coming soon" note instead. */
export type CourseDetails = {
  /** Small line above the course name; defaults to "BISCOTECH ACADEMY" */
  heroLabel?: string;
  /** Name in the hero when Figma's differs from the catalogue's; defaults to the title */
  heroTitle?: string;
  /** Paragraph under the course name in the hero */
  intro: string;
  /** Quick facts in the hero's fee card */
  facts: { value: string; label: string }[];
  /** Figma's narrower fee card (416px, not 464px), for shorter facts */
  narrowFeeCard?: boolean;
  sections: CourseSection[];
  /** The green card at the bottom; *asterisks* mark the italic words in its title */
  cta: { label: string; title: string; description: string; action: string };
  /** Figma's smaller gap (27px, not 96px) from the green card down to the bottom row */
  closeFooter?: boolean;
};

export type Course = {
  /** URL part: /academy/product-design */
  slug: string;
  tag: string;
  icon: ReactNode;
  title: string;
  /** Short text on the catalogue card */
  description: string;
  pathway: string;
  /** Fixed length of the course, e.g. "12 weeks" */
  duration: string;
  /** Fee in naira for each way of taking the course */
  fees: Record<TrainingMode, number>;
  details?: CourseDetails;
};

export const courses: Course[] = [
  {
    slug: "product-design",
    duration: "12 weeks",
    fees: { physical: 200000, online: 150000, executive: 250000 },
    tag: "01 / DESIGN",
    icon: <NorthStar />,
    title: "Product Design",
    description:
      "Learn to design thoughtful digital experiences, from understanding users to creating polished interfaces.",
    pathway: "Beginner-friendly pathway",
    details: productDesign,
  },
  {
    slug: "digital-marketing",
    duration: "12 weeks",
    fees: { physical: 150000, online: 100000, executive: 200000 },
    tag: "02 / GROW",
    icon: <DarkArrowRightUp />,
    title: "Digital Marketing",
    description:
      "Explore content, social media, campaigns, and ways to measure digital marketing performance.",
    pathway: "Practical learning pathway",
    details: digitalMarketing,
  },
  {
    slug: "front-end-development",
    duration: "14 weeks",
    fees: { physical: 200000, online: 150000, executive: 300000 },
    tag: "03 / FRONT END",
    icon: <CodeIcon />,
    title: "Front-End Development",
    description:
      "Discover how to turn interface designs into responsive, accessible websites with code.",
    pathway: "Web development pathway",
    details: frontEnd,
  },
  {
    slug: "back-end-development",
    duration: "12 weeks",
    fees: { physical: 200000, online: 150000, executive: 300000 },
    tag: "04 / BACK END",
    icon: <CommandKeyIcon />,
    title: "Back-End Development",
    description:
      "Explore the server-side logic, databases, and APIs that power digital products.",
    pathway: "Web development pathway",
    details: backEnd,
  },
  {
    slug: "app-development",
    duration: "12 weeks",
    fees: { physical: 250000, online: 150000, executive: 300000 },
    tag: "05 / MOBILE",
    icon: <SmartphoneIcon />,
    title: "App Development",
    description:
      "Learn to design and build functional mobile applications for everyday use.",
    pathway: "Web development pathway",
    details: appDevelopment,
  },
  {
    slug: "full-stack-development",
    duration: "16–20 weeks",
    fees: { physical: 350000, online: 250000, executive: 500000 },
    tag: "06 / FULL STACK",
    icon: <LayersIcon />,
    title: "Full stack Development",
    description:
      "Learn to build complete web applications, from frontend interfaces to backend systems.",
    pathway: "Web development pathway",
    details: fullStack,
  },
  {
    slug: "python-backend-development",
    duration: "12 weeks",
    fees: { physical: 150000, online: 120000, executive: 250000 },
    tag: "07 / PYTHON",
    icon: <CodeIcon />,
    title: "Python Backend Development",
    description:
      "Go from Python fundamentals to building powerful backend systems with FastAPI and Django.",
    pathway: "Web development pathway",
    details: pythonBackend,
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

/** "12 weeks" → "P12W"; for a range like "16–20 weeks", the shortest */
function isoWeeks(duration: string) {
  const weeks = duration.match(/\d+/)?.[0];
  return weeks ? `P${weeks}W` : undefined;
}

/** The course's Google data beyond its name: one offer per way of taking it (each linking to
 *  the registration form), its length, and that it runs in person and online (Executive:
 *  one-on-one, either way). Google uses the
 *  offers and course instances for its course listings. */
export function courseOffer(course: Course) {
  const register = `${siteConfig.url}/academy/register?course=${course.slug}`;
  const duration = isoWeeks(course.duration);
  return {
    ...(duration && { timeRequired: duration }),
    offers: trainingModes.map((mode) => ({
      "@type": "Offer",
      name: mode.label,
      category: "Paid",
      price: String(course.fees[mode.id]),
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: register,
    })),
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Onsite",
        location: {
          "@type": "Place",
          name: "BiscoTech Academy",
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            addressCountry: siteConfig.address.countryCode,
          },
        },
        ...(duration && { courseSchedule: { "@type": "Schedule", duration, repeatFrequency: "P1W" } }),
      },
      {
        "@type": "CourseInstance",
        courseMode: "Online",
        ...(duration && { courseSchedule: { "@type": "Schedule", duration, repeatFrequency: "P1W" } }),
      },
      // Executive training: one-on-one, taken online or at the academy
      {
        "@type": "CourseInstance",
        name: "Executive training (one-on-one)",
        courseMode: ["Online", "Onsite"],
        ...(duration && { courseSchedule: { "@type": "Schedule", duration, repeatFrequency: "P1W" } }),
      },
    ],
  };
}
