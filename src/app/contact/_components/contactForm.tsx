"use client";
import { useState } from "react";
import Typography from "@/components/ui/typography";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { ArrowUpEnd } from "@/components/ui/reusable/svg";
import { cn } from "@/lib/utils";
import {
  compactField,
  estimates,
  fieldClass,
  fieldContainer,
  labelClass,
  services,
} from "@/components/ui/reusable/inquiry";
import { HoneypotField, useInquiry } from "@/components/ui/reusable/useInquiry";

// The white "Tell us about your project" card on the Contact page (Figma: 48px top/bottom,
// 43px left, 34px between groups, fields in two 199px columns 14px apart).
export default function ContactForm() {
  const [service, setService] = useState("");
  const [estimate, setEstimate] = useState("");
  // Sends to the backend; clears the dropdowns once it's sent
  const { sending, handleSubmit } = useInquiry(() => {
    setService("");
    setEstimate("");
  });

  return (
    // Laptop+: takes 48% of the row (≈ Figma's 579px at 1200px) so it also fits on smaller
    // laptops; the form inside is capped at Figma's 425px, left-aligned like the design
    <div className="w-full rounded-[1.25rem] border border-secondary-accent bg-cards-and-sections px-5 py-8 md:px-10 md:py-12 lg:w-[48%] lg:shrink-0 lg:pr-6 lg:pl-10.75">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-6 md:gap-8.5 lg:max-w-106.25"
      >
        <HoneypotField />
        <div className="flex flex-col gap-2 md:gap-3.5">
          <Typography variant="subHeading" as="h2" className="text-primary-brand">
            Tell us about your project
          </Typography>
          <Typography variant="body" className="text-text-charcoal">
            Share a few details so we can understand what you need.
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-x-3.5 gap-y-5 sm:grid-cols-2 md:gap-y-8.5">
          <Input
            name="name"
            label="Your name *"
            placeholder="Your name"
            autoComplete="name"
            required
            className={cn(fieldClass, compactField)}
            labelClassName={labelClass}
            containerClassName={fieldContainer}
          />
          <Input
            name="email"
            type="email"
            label="Email address *"
            placeholder="you@company"
            autoComplete="email"
            required
            className={cn(fieldClass, compactField)}
            labelClassName={labelClass}
            containerClassName={fieldContainer}
          />
          <Input
            name="business"
            label="Your business *"
            placeholder="Your business"
            autoComplete="organization"
            required
            className={cn(fieldClass, compactField)}
            labelClassName={labelClass}
            containerClassName={fieldContainer}
          />
          <Select
            name="service"
            label="What do you need? *"
            placeholder="Website dev"
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
            // Placeholder shows in sage until something is picked, like the inputs
            className={cn(fieldClass, compactField, !service && "text-secondary-accent")}
            labelClassName={labelClass}
            containerClassName={cn(fieldContainer, "text-primary-brand")}
          >
            {services.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <Select
          name="estimate"
          label="What's your estimate?"
          placeholder="I'd like to discuss this"
          value={estimate}
          onChange={(e) => setEstimate(e.target.value)}
          className={cn(fieldClass, compactField, !estimate && "text-secondary-accent")}
          labelClassName={labelClass}
          containerClassName={cn(fieldContainer, "text-primary-brand")}
        >
          {estimates.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <Textarea
          name="project"
          label="Tell us about your project *"
          placeholder="What are you building, and what are you looking to achieve?"
          required
          className={fieldClass}
          labelClassName={labelClass}
          containerClassName={fieldContainer}
        />

        <Button
          type="submit"
          icon={<ArrowUpEnd />}
          disabled={sending}
          aria-busy={sending}
          className="w-full border-primary-brand bg-primary-brand py-3.5 text-cards-and-sections disabled:cursor-wait disabled:opacity-70 md:py-4.5"
        >
          {sending ? "Sending…" : "Prepare inquiry"}
        </Button>
      </form>
    </div>
  );
}
