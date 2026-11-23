import type { ComponentProps, ReactNode } from "react";
import Typography from "@/components/ui/typography";
import { variantStyles } from "@/components/ui/typography";
import { ChevronDown } from "@/components/ui/reusable/svg";
import { cn } from "@/lib/utils";
import { InfoIcon } from "./registerIcons";

// Shared pieces of the registration and checkout forms, styled like the site's other forms
// (Figma: white field, sage border, 20px corners, 66px tall; Manrope bold labels with a *).

export const fieldBox =
  "flex w-full items-center gap-2.5 rounded-[1.25rem] border border-secondary-accent bg-cards-and-sections px-5 transition-[border-color,box-shadow] duration-300 focus-within:border-light-teal focus-within:ring-4 focus-within:ring-light-teal/15 hover:border-light-teal/60 md:px-6";
export const fieldText = cn(
  variantStyles.cardHeading,
  "w-full min-w-0 bg-transparent py-3.5 text-primary-brand outline-none placeholder:text-secondary-accent md:py-4.25",
);

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={cn(variantStyles.contactHeader, "text-primary-brand")}>
      {children} <span aria-hidden="true">*</span>
    </label>
  );
}

type TextFieldProps = ComponentProps<"input"> & { label: string; icon?: ReactNode };

/** A labelled text input, optionally with a line icon inside on the left */
export function TextField({ label, icon, id, className, ...props }: TextFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 md:gap-4.5", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className={fieldBox}>
        {icon && <span className="shrink-0 text-secondary-accent">{icon}</span>}
        <input id={id} required className={fieldText} {...props} />
      </div>
    </div>
  );
}

type SelectFieldProps = ComponentProps<"select"> & {
  label: string;
  icon?: ReactNode;
  placeholder: string;
  options: { value: string; label: string }[];
};

/** A labelled dropdown with Figma's icon on the left and chevron on the right */
export function SelectField({ label, icon, id, placeholder, options, value, ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2.5 md:gap-4.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className={cn(fieldBox, "relative")}>
        {icon && <span className="shrink-0 text-secondary-accent">{icon}</span>}
        <select
          id={id}
          required
          value={value}
          className={cn(fieldText, "cursor-pointer appearance-none pr-8", !value && "text-secondary-accent")}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-primary-brand">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-5 size-5 text-primary-brand md:right-6" />
      </div>
    </div>
  );
}

/** The round radio mark used on the choice cards; filled when selected */
export function RadioMark({ checked, light }: { checked: boolean; light?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
        light ? "border-cards-and-sections" : "border-primary-brand",
      )}
    >
      <span
        className={cn(
          "size-2.5 rounded-full transition-transform duration-300",
          light ? "bg-cards-and-sections" : "bg-primary-brand",
          checked ? "scale-100" : "scale-0",
        )}
      />
    </span>
  );
}

/** The step's big icon, title and line underneath (Figma: 113px mark, 28px title) */
export function StepTitle({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="flex items-center gap-3 md:gap-2">
      <span className="shrink-0 text-primary-brand">{icon}</span>
      <div className="flex flex-col gap-1 md:gap-3.5">
        <Typography variant="subHeading" as="h2" className="font-normal text-primary-brand">
          {title}
        </Typography>
        {text && (
          <Typography variant="largeBody" as="p" className="text-primary-brand">
            {text}
          </Typography>
        )}
      </div>
    </div>
  );
}

/** Figma's dark teal note bar at the bottom of each step */
export function PrivacyNote({ children = "Your information is safe with us. We respect your privacy." }: { children?: ReactNode }) {
  return (
    <p className="flex items-center gap-3 rounded-md bg-primary-brand px-4 py-3.5 text-cards-and-sections md:px-6">
      <InfoIcon className="size-6 shrink-0 text-cards-and-sections" />
      <Typography variant="primaryButton" as="span">
        {children}
      </Typography>
    </p>
  );
}
