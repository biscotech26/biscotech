import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/components/ui/reusable/inquiry";

// The site's address, used for canonical URLs, the sitemap, structured data and the preview
// cards. `next dev` uses localhost so links work while developing; every real build, Vercel
// previews included, points at the live domain so Google only ever indexes that.
const siteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.biscotech.org";

const address = {
  street: "No. 8 Anjali Crescent, Independence Layout",
  city: "Enugu",
  state: "Enugu State",
  countryCode: "NG",
  country: "Nigeria",
};

// Footer icons and the structured data. An empty url hides that icon until it's filled in.
const socialLinks = {
  // A post for now; swap in the LinkedIn page itself (linkedin.com/company/... or /in/...) when known
  linkedin: "https://www.linkedin.com/posts/bisco-tech_introduction-activity-7515479473140711424-rs7r",
  instagram: "https://www.instagram.com/bisco.tech/",
  tiktok: "https://www.tiktok.com/@bisco.tech",
};

export const siteConfig = {
  name: "BiscoTech",
  url: siteUrl,
  // Home page <title>: what the business does, for people scanning search results
  title: "BiscoTech | Web Design, Branding & Marketing Agency in Enugu",
  tagline: "Thoughtful design. Meaningful impact.",
  // Kept under 160 characters so search results don't cut it off
  description:
    "BiscoTech is a digital agency in Enugu, Nigeria, for web and app development, branding, digital marketing and SEO, with an Academy teaching digital skills.",
  email: CONTACT_EMAIL,
  // Shown on the Contact page and used in the structured data. Keep them identical everywhere.
  phone: { display: "0806 373 3157", tel: "+2348063733157" },
  // Opens a chat with the same number in the WhatsApp app (phones) or WhatsApp Web (computers)
  whatsapp: "https://wa.me/2348063733157",
  address,
  socialLinks,
  // The profiles search engines tie to the business (structured data sameAs)
  socials: Object.values(socialLinks).filter(Boolean),
  // A Google Maps search for the address (Contact page "Visit us" and the structured data).
  // Swap in the Google Business Profile share link if there is one.
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.city}, ${address.country}`,
  )}`,
  // Google needs a logo of at least 112×112px; Logo.png is only 60×71
  logo: "/img/LogoLarge.png",
  keywords: [
    "BiscoTech",
    "digital agency",
    "digital agency in Enugu",
    "web design Enugu",
    "digital marketing Enugu",
    "tech training Enugu",
    "web design",
    "website development",
    "app development",
    "branding",
    "visual identity",
    "digital marketing",
    "social media management",
    "search engine optimisation",
    "SEO",
    "digital consulting",
    "BiscoTech Academy",
    "tech courses",
    "digital skills training",
    "product design course",
    "front-end development course",
    "back-end development course",
    "full stack development course",
    "digital marketing course",
  ],
  // Credited as the site's developer in the meta tags, structured data and humans.txt
  developer: {
    name: "Favour Okpara",
    url: "https://github.com/Okpara202",
  },
} as const;

/** Points structured data at the Organization defined in the layout */
export const organizationRef = {
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
};

type PageSeo = {
  /** Page name; the layout's template adds " | BiscoTech". Omit on the home page. */
  title?: string;
  description: string;
  /** Route path, e.g. "/services" */
  path: string;
};

// Next merges metadata shallowly, so a page that sets openGraph/twitter replaces the
// layout's ones completely. This builds the full set per page so every link still gets
// a preview card (the opengraph-image.tsx next to the page), the right title/description
// and a canonical URL.
export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const image = {
    url: `${path === "/" ? "" : path}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: fullTitle,
  };

  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

type PageJsonLd = {
  /** schema.org page type */
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  /** Short page name, used in Google's breadcrumb trail, e.g. "Services" */
  name: string;
  description: string;
  path: string;
  /** Pages between Home and this one in the breadcrumb */
  parents?: { name: string; path: string }[];
  /** Anything else this page describes (services, courses...) */
  extra?: object[];
};

// Structured data for one page: what kind of page it is and, except on the home page, the
// breadcrumb Google can show instead of the raw URL. Render with <JsonLd />.
export function pageJsonLd({
  type = "WebPage",
  name,
  description,
  path,
  parents = [],
  extra = [],
}: PageJsonLd) {
  const isHome = path === "/";
  const url = isHome ? siteConfig.url : `${siteConfig.url}${path}`;
  const crumbs = [{ name: "Home", path: "" }, ...parents, { name, path }];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}/#webpage`,
        url,
        name,
        description,
        inLanguage: "en",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#organization` },
        ...(!isHome && { breadcrumb: { "@id": `${url}/#breadcrumb` } }),
      },
      ...(isHome
        ? []
        : [
            {
              "@type": "BreadcrumbList",
              "@id": `${url}/#breadcrumb`,
              itemListElement: crumbs.map((crumb, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: crumb.name,
                item: `${siteConfig.url}${crumb.path}`,
              })),
            },
          ]),
      ...extra,
    ],
  };
}
