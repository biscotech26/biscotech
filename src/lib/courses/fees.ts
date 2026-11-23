// The ways to take a course and how fees are written. A small file of its own so the
// registration form (in the browser) can use it without loading every course's page content.

/** The three ways to take a course; each has its own fee (official Academy fee list) */
export const trainingModes = [
  { id: "physical", label: "Physical training", short: "Physical", description: "Attend in person at our academy" },
  { id: "online", label: "Online training", short: "Online", description: "Learn remotely from anywhere" },
  {
    id: "executive",
    label: "Executive training",
    short: "Executive",
    description: "One-on-one training, online or physical",
  },
] as const;

export type TrainingMode = (typeof trainingModes)[number]["id"];

/** 150000 → "₦150,000" */
export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
