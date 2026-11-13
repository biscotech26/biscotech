import JsonLd from "@/components/ui/reusable/jsonLd";
import { pageJsonLd, pageMetadata } from "@/lib/seo";
import ContactHero from "./_components/contactHero";

const description =
  "Visit BiscoTech in Independence Layout, Enugu, call 0806 373 3157, or tell us about your project and let's start a conversation.";

export const metadata = pageMetadata({
  title: "Contact Us: Start Your Project",
  description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <JsonLd data={pageJsonLd({ type: "ContactPage", name: "Contact", description, path: "/contact" })} />
    </>
  );
}
