import type { Metadata } from "next";
import { courses } from "@/lib/courses";
import { siteConfig } from "@/lib/seo";
import InvoiceView from "./_components/invoiceView";

// Someone's own invoice, so it stays out of search results
export const metadata: Metadata = {
  title: "Your Invoice",
  robots: { index: false, follow: false },
};

export default function InvoicePage() {
  const options = courses.map(({ slug, title, duration, fees }) => ({ slug, title, duration, fees }));
  const { address, phone, email } = siteConfig;
  return (
    <InvoiceView
      courses={options}
      academy={{
        address: `${address.street}, ${address.city}`,
        phone: phone.display,
        email,
      }}
    />
  );
}
