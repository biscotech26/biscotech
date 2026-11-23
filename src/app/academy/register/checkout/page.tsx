import type { Metadata } from "next";
import { courses } from "@/lib/courses";
import CheckoutView from "./_components/checkoutView";

// A step in someone's own registration, so it stays out of search results
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  const options = courses.map(({ slug, title, duration, fees }) => ({ slug, title, duration, fees }));
  return <CheckoutView courses={options} />;
}
