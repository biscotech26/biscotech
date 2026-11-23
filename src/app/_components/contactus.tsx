"use client";
import { useState } from "react";
import Typography, { variantStyles } from "@/components/ui/typography";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import { ArrowUpEnd, DarkArrowRightUp } from "@/components/ui/reusable/svg";
import { cn } from "@/lib/utils";
import {
  CONTACT_EMAIL,
  compactField,
  estimates,
  fieldClass,
  fieldContainer,
  labelClass,
  services,
} from "@/components/ui/reusable/inquiry";
import { HoneypotField, useInquiry } from "@/components/ui/reusable/useInquiry";

export default function ContactUs() {
  const [service, setService] = useState("");
  const [estimate, setEstimate] = useState("");
  // Sends to the backend; clears the dropdowns once it's sent
  const { sending, handleSubmit } = useInquiry(() => {
    setService("");
    setEstimate("");
  });

  return (
    <section id="contact" className="scroll-mt-8 bg-main-background py-16 lg:py-24">
      <div className="mx-auto flex page-container flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        {/* Intro */}
        <div className="flex flex-col items-start gap-4 md:gap-5 lg:w-110.75 lg:shrink-0">
          <Typography variant="navigation" className="text-primary-brand">
            LET&apos;S TALK
          </Typography>
          <Typography variant="section" className="text-primary-brand">
            Let&apos;s make{" "}
            <Typography variant="span-newsreader">something meaningful</Typography>
          </Typography>
          <Typography variant="body" className="text-text-charcoal lg:w-72.25">
            Share a little about your project. We&apos;ll use it to understand
            what you need and how we might help.
          </Typography>

          <div className="flex flex-col items-start gap-1">
            <Typography variant="body" className="text-text-charcoal">
              EMAIL
            </Typography>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={cn(
                "group inline-flex items-center gap-2 py-3 text-primary-brand",
                variantStyles.primaryButton,
              )}
            >
              <span className="underline-offset-4 group-hover:underline">
                {CONTACT_EMAIL}
              </span>
              <DarkArrowRightUp />
            </a>
          </div>

          <div className="flex flex-col gap-2 text-text-charcoal">
            <Typography variant="body">WORKING WITH</Typography>
            <Typography variant="body">
              Startups · Businesses · Personal brands
            </Typography>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex w-full flex-col items-start gap-4.5 lg:w-161.5"
        >
          <HoneypotField />
          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-4.5 sm:grid-cols-2">
            <Input
              name="name"
              label="Your name *"
              placeholder="E.g Alex Johnson"
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
              placeholder="E.g alex@company.com"
              autoComplete="email"
              required
              className={cn(fieldClass, compactField)}
              labelClassName={labelClass}
              containerClassName={fieldContainer}
            />
            <Select
              name="service"
              // Required by the backend
              label="What do you need? *"
              placeholder="Website design & dev"
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
          </div>

          <Textarea
            name="project"
            label="Tell us about your project *"
            placeholder="What are you building, and what are you looking to achieve?"
            required
            className={fieldClass}
            labelClassName={labelClass}
            containerClassName={cn(fieldContainer, "w-full")}
          />

          <Button
            type="submit"
            icon={<ArrowUpEnd />}
            disabled={sending}
            aria-busy={sending}
            className="w-full border-primary-brand bg-primary-brand text-cards-and-sections disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {sending ? "Sending…" : "Prepare inquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}
