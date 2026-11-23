import { ogCard, ogSize } from "@/lib/ogCard";

export const alt = "Register for a BiscoTech Academy course";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    label: "BiscoTech Academy",
    title: "Start your learning journey.",
    text: "Build practical skills. Develop your confidence. Prepare for opportunities in Tech.",
  });
}
