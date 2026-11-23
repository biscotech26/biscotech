import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { CheckIcon } from "./registerIcons";

const steps = ["Personal information", "Courses & Preferences", "Review & Confirm"];

// The three-step progress bar (Figma: 40px circles joined by lines; done = dark teal with a
// tick, current = dark teal with its number, next = sage). Labels sit under each circle.
export default function Stepper({ current }: { current: number }) {
  return (
    <ol aria-label="Registration steps" className="grid grid-cols-3">
      {steps.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className="relative flex flex-col items-center gap-3 text-center md:gap-5"
          >
            {/* Line to the next circle */}
            {step < steps.length && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-4.75 left-1/2 h-0.5 w-full transition-colors duration-500 md:top-5",
                  done ? "bg-primary-brand" : "bg-secondary-accent",
                )}
              />
            )}
            <span
              className={cn(
                "relative flex size-9.5 items-center justify-center rounded-full transition-colors duration-500 md:size-10",
                done || active ? "bg-primary-brand text-cards-and-sections" : "bg-secondary-accent text-primary-brand",
              )}
            >
              {done ? (
                <CheckIcon className="size-5" />
              ) : (
                <Typography variant="body" as="span" className="font-medium">
                  {step}
                </Typography>
              )}
            </span>
            <Typography
              variant="primaryButton"
              as="span"
              className={cn(
                "max-w-28 text-xs md:max-w-none md:text-base",
                done || active ? "text-primary-brand" : "text-secondary-accent",
              )}
            >
              {label}
            </Typography>
          </li>
        );
      })}
    </ol>
  );
}
