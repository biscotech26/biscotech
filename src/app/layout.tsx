import type { Metadata, Viewport } from "next";
import { DM_Sans, Inter, Manrope, Newsreader } from "next/font/google";
import Header from "@/components/ui/reusable/header";
import Footer from "@/components/ui/reusable/footer";
import JsonLd from "@/components/ui/reusable/jsonLd";
import WhatsAppButton from "@/components/ui/reusable/whatsappButton";
import Toaster from "@/components/ui/reusable/toaster";
import { pageMetadata, siteConfig } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const { developer } = siteConfig;

export const metadata: Metadata = {
  // Makes every relative URL below (canonical, og:image...) absolute
  metadataBase: new URL(siteConfig.url),
  // Pages set just their name ("Services") and get "Services | BiscoTech"
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  // <meta name="author">, <link rel="author"> and <meta name="creator"> credit the developer
  authors: [{ name: developer.name, url: developer.url }],
  creator: developer.name,
  publisher: siteConfig.name,
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    // Extra plain-text credits, also read by crawlers
    designer: "Kassie",
    developer: developer.name,
  },
  ...pageMetadata({ description: siteConfig.description, path: "/" }),
};

export const viewport: Viewport = {
  themeColor: "#123F3A",
};

// Structured data (schema.org) Google reads for the knowledge panel and rich results:
// the agency, the website, and Favour Okpara credited as the site's developer.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // A local business with a physical space, so it can appear in local results
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.logo}`,
      image: `${siteConfig.url}${siteConfig.logo}`,
      email: siteConfig.email,
      telephone: siteConfig.phone.tel,
      description: siteConfig.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        addressCountry: siteConfig.address.countryCode,
      },
      // Lets Google link the listing to the office on the map
      hasMap: siteConfig.mapsUrl,
      sameAs: [...siteConfig.socials],
      knowsAbout: [
        "Web design",
        "Website and app development",
        "Branding and visual identity",
        "Digital marketing",
        "Social media management",
        "Search engine optimisation",
        "Digital skills training",
      ],
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#developer`,
      name: developer.name,
      url: developer.url,
      sameAs: [developer.url],
      jobTitle: "Web Developer",
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": `${siteConfig.url}/#organization` },
      creator: { "@id": `${siteConfig.url}/#developer` },
      author: { "@id": `${siteConfig.url}/#developer` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSans.variable} ${newsreader.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={jsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}
