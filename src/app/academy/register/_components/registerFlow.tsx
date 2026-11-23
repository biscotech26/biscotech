"use client";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { ArrowUpEnd, BackArrow } from "@/components/ui/reusable/svg";
import { formatNaira, trainingModes, type TrainingMode } from "@/lib/courses/fees";
import {
  emptyRegistration,
  experienceLevels,
  loadRegistration,
  paymentOptions,
  saveRegistration,
  type Registration,
} from "@/lib/registration";
import { cn } from "@/lib/utils";
import { PrivacyNote, RadioMark, SelectField, StepTitle, TextField } from "./formParts";
import RegisterHero from "./registerHero";
import {
  BankIcon,
  BookIcon,
  CapIcon,
  CheckCircleFilledIcon,
  GlobeIcon,
  HomeIcon,
  LaptopIcon,
  MailIcon,
  PhoneIcon,
  ProfileCircleIcon,
  StarBadgeIcon,
  UserIcon,
} from "./registerIcons";
import Stepper from "./stepper";

export type CourseOption = {
  slug: string;
  title: string;
  duration: string;
  fees: Record<TrainingMode, number>;
};

const modeIcons: Record<TrainingMode, ReactNode> = {
  physical: <HomeIcon className="size-8" />,
  online: <LaptopIcon className="size-8" />,
  executive: <StarBadgeIcon className="size-8" />,
};

// Figma's review step offers these two; checkout offers all three
const reviewPayments = paymentOptions.filter((option) => option.id !== "bank");

// The three-step registration form (Figma: Course Registration, Courses and pref, Review and
// confirm). Each step checks its own fields before moving on; answers are saved in the browser
// so checkout can read them and "Back" from checkout returns with everything filled in.
export default function RegisterFlow({
  courses,
  initialCourse,
}: {
  courses: CourseOption[];
  initialCourse?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Registration>(() => ({
    ...emptyRegistration,
    courseSlug: courses.some((c) => c.slug === initialCourse) ? initialCourse! : "",
  }));
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const formTop = useRef<HTMLDivElement>(null);

  // Pick up where they left off (e.g. coming back from checkout); a course chosen on the
  // course page still wins
  useEffect(() => {
    const saved = loadRegistration();
    if (!saved) return;
    // Browser storage can only be read after hydration, or the server and browser HTML differ
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData((current) => ({ ...saved, courseSlug: current.courseSlug || saved.courseSlug }));
  }, []);

  const update = (fields: Partial<Registration>) => {
    setError("");
    setData((current) => ({ ...current, ...fields }));
  };

  const course = courses.find((c) => c.slug === data.courseSlug);

  const goTo = (next: number) => {
    setStep(next);
    setError("");
    // Back to the top of the form so the new step starts in view
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    if (step === 2 && (!data.experience || !data.mode)) {
      setError("Choose your experience level and how you'd like to take the course.");
      return;
    }
    saveRegistration(data);
    if (step < 3) {
      goTo(step + 1);
      return;
    }
    if (!agreed) {
      setError("Please agree to the terms and conditions to continue.");
      return;
    }
    router.push("/academy/register/checkout");
  }

  return (
    <>
      <RegisterHero step={step} />

      <section className="bg-main-background pt-14 pb-16 md:pt-20.5 lg:pb-24">
        <div ref={formTop} className="page-container flex scroll-mt-32 flex-col gap-10 md:gap-16">
          <div className="lg:px-12">
            <Stepper current={step} />
          </div>

          <form noValidate={false} onSubmit={onSubmit} className="flex flex-col gap-10 md:gap-18">
            <div className="flex flex-col gap-8 rounded-[0.625rem] border border-secondary-accent px-5 py-8 md:gap-10 md:px-10 md:py-12 lg:px-20.5 lg:py-16">
              {step === 1 && (
                <>
                  <StepTitle
                    icon={<ProfileCircleIcon className="size-16 md:size-28" />}
                    title="Personal Information"
                    text="Tell us a bit about yourself"
                  />
                  <div className="grid gap-6 md:grid-cols-2 md:gap-x-6.5">
                    <TextField
                      id="firstName"
                      label="First name"
                      placeholder="Enter first name"
                      autoComplete="given-name"
                      value={data.firstName}
                      onChange={(e) => update({ firstName: e.target.value })}
                    />
                    <TextField
                      id="lastName"
                      label="Last name"
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      value={data.lastName}
                      onChange={(e) => update({ lastName: e.target.value })}
                    />
                    <TextField
                      id="email"
                      type="email"
                      label="Email address"
                      placeholder="Enter email address"
                      autoComplete="email"
                      icon={<MailIcon />}
                      className="md:col-span-2"
                      value={data.email}
                      onChange={(e) => update({ email: e.target.value })}
                    />
                    <TextField
                      id="phone"
                      type="tel"
                      label="Phone number/WhatsApp number"
                      placeholder="Enter phone number"
                      autoComplete="tel"
                      icon={<PhoneIcon />}
                      className="md:col-span-2"
                      value={data.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                    />
                    <TextField
                      id="country"
                      label="Country of residence"
                      placeholder="Enter country"
                      autoComplete="country-name"
                      icon={<GlobeIcon />}
                      className="md:col-span-2"
                      value={data.country}
                      onChange={(e) => update({ country: e.target.value })}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <StepTitle
                    icon={<ProfileCircleIcon className="size-16 md:size-28" />}
                    title="Course selection"
                    text="Choose your course and how you'd like to learn"
                  />
                  <SelectField
                    id="course"
                    label="Select preferred course"
                    placeholder="Choose a course"
                    icon={<BookIcon />}
                    value={data.courseSlug}
                    onChange={(e) => update({ courseSlug: e.target.value })}
                    options={courses.map((c) => ({ value: c.slug, label: c.title }))}
                  />

                  <fieldset className="flex flex-col gap-2.5 md:gap-4.5">
                    <legend className="mb-2.5 font-manrope font-bold text-primary-brand md:mb-4.5">
                      What is your current experience level? <span aria-hidden="true">*</span>
                    </legend>
                    <div className="grid gap-3 md:grid-cols-3 md:gap-6.5">
                      {experienceLevels.map((level) => {
                        const checked = data.experience === level.id;
                        return (
                          <label
                            key={level.id}
                            className={cn(
                              "flex cursor-pointer items-start gap-4 rounded-[0.625rem] border px-5 py-5 transition-colors duration-300 md:min-h-32 md:py-6",
                              checked
                                ? "border-primary-brand bg-cards-and-sections"
                                : "border-secondary-accent hover:border-light-teal/60",
                            )}
                          >
                            <input
                              type="radio"
                              name="experience"
                              value={level.id}
                              checked={checked}
                              onChange={() => update({ experience: level.id })}
                              className="sr-only"
                            />
                            <RadioMark checked={checked} />
                            <span className="flex flex-col gap-1">
                              <Typography variant="cardHeading" as="span" className="font-normal text-text-charcoal">
                                {level.label}
                              </Typography>
                              <Typography variant="text" as="span" className="text-text-charcoal/60">
                                {level.description}
                              </Typography>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <legend className="mb-2.5 font-manrope font-bold text-primary-brand md:mb-4.5">
                      How would you like to take the course? <span aria-hidden="true">*</span>
                    </legend>
                    <div className="grid gap-3 md:grid-cols-3 md:gap-4.5">
                      {trainingModes.map((mode) => {
                        const checked = data.mode === mode.id;
                        return (
                          <label
                            key={mode.id}
                            className={cn(
                              "relative flex cursor-pointer flex-col items-center gap-2 rounded-[1.25rem] px-5 pt-12 pb-8 text-center text-cards-and-sections ring-offset-2 ring-offset-main-background transition-[background-color,box-shadow] duration-300 md:pt-14",
                              checked ? "bg-primary-brand ring-2 ring-light-teal" : "bg-[#26504A] hover:bg-primary-brand",
                            )}
                          >
                            <input
                              type="radio"
                              name="mode"
                              value={mode.id}
                              checked={checked}
                              onChange={() => update({ mode: mode.id })}
                              className="sr-only"
                            />
                            <span className="absolute top-5 left-5 md:top-6 md:left-8">
                              <RadioMark checked={checked} light />
                            </span>
                            {modeIcons[mode.id]}
                            <Typography variant="cardHeading" as="span" className="font-normal">
                              {mode.label}
                            </Typography>
                            <Typography variant="body" as="span">
                              {mode.description}
                            </Typography>
                            {/* The fee for this option, once a course is chosen */}
                            <Typography variant="subHeading" as="span" className="mt-2 text-[#D7B98E]">
                              {course ? formatNaira(course.fees[mode.id]) : "Choose a course"}
                            </Typography>
                            {course && (
                              <Typography variant="text" as="span" className="opacity-80">
                                {course.duration}
                              </Typography>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </>
              )}

              {step === 3 && course && (
                <>
                  <StepTitle icon={<CheckCircleFilledIcon className="size-11 md:size-14" />} title="Review and confirm" />

                  <div className="flex flex-col gap-4 lg:max-w-198">
                    <ReviewPanel
                      icon={<UserIcon />}
                      title="Personal information"
                      rows={[
                        ["Full name", `${data.firstName} ${data.lastName}`],
                        ["Email", data.email],
                        ["Phone no", data.phone],
                        ["Country", data.country],
                      ]}
                    />
                    <ReviewPanel
                      icon={<CapIcon />}
                      title="Course learning & preferences"
                      rows={[
                        ["Course", course.title],
                        ["Experience level", experienceLevels.find((l) => l.id === data.experience)?.label ?? ""],
                        ["Learning mode", trainingModes.find((m) => m.id === data.mode)?.label ?? ""],
                        ["Duration", course.duration],
                        ["Course fee", data.mode ? formatNaira(course.fees[data.mode]) : ""],
                      ]}
                    />
                  </div>

                  <div className="flex flex-col gap-5">
                    <StepTitle
                      icon={<BankIcon className="size-14 md:size-20" />}
                      title="Payment information"
                      text="Choose how you would like to pay your course fee."
                    />
                    <div className="flex flex-col gap-4 lg:max-w-223.5">
                      {reviewPayments.map((option) => {
                        const checked = data.payment === option.id;
                        return (
                          <label
                            key={option.id}
                            className={cn(
                              "flex cursor-pointer items-start gap-4 rounded-[0.625rem] border px-5 py-5 transition-colors duration-300 md:px-8",
                              checked ? "border-primary-brand" : "border-secondary-accent hover:border-light-teal/60",
                            )}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={option.id}
                              checked={checked}
                              onChange={() => update({ payment: option.id })}
                              className="sr-only"
                            />
                            <RadioMark checked={checked} />
                            <span className="flex flex-1 flex-col gap-2">
                              <span className="flex flex-wrap items-center justify-between gap-2">
                                <Typography variant="cardHeading" as="span" className="font-normal text-black">
                                  {option.label}
                                </Typography>
                                {option.id === "online" && (
                                  <span className="rounded-full bg-secondary-accent px-5 py-1.5">
                                    <Typography variant="text" as="span" className="text-text-charcoal">
                                      Recommended
                                    </Typography>
                                  </span>
                                )}
                              </span>
                              <Typography variant="text" as="span" className="text-black">
                                {option.id === "academy"
                                  ? "Visit the academy to make your payment. Your registration will remain pending until payment is verified."
                                  : "Pay securely through the online payment gateway."}
                              </Typography>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-md bg-[#26504A] px-5 py-3 text-cards-and-sections lg:max-w-223.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setError("");
                        setAgreed(e.target.checked);
                      }}
                      className="size-5 shrink-0 cursor-pointer accent-cards-and-sections"
                    />
                    <Typography variant="primaryButton" as="span">
                      I agree with the terms and conditions
                    </Typography>
                  </label>
                </>
              )}

              {step < 3 && <PrivacyNote />}

              {error && (
                <p role="alert" className="text-sm font-medium text-[#B42318]">
                  {error}
                </p>
              )}
            </div>

            {/* Figma: "Need help? Contact us" (step 1) or "Back" on the left, "Next step" on the right */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {step === 1 ? (
                <p className="flex items-center gap-3">
                  <Typography variant="contactHeader" as="span" className="text-black">
                    Need help?
                  </Typography>
                  <Button variant="text" href="/contact" className="border-0 px-0 text-primary-brand">
                    Contact us
                  </Button>
                </p>
              ) : (
                <Button
                  variant="text"
                  onClick={() => goTo(step - 1)}
                  icon={<BackArrow className="size-5" />}
                  iconPosition="left"
                  className="border-0 px-0 text-primary-brand"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                icon={<ArrowUpEnd />}
                className="border-0 bg-primary-brand text-cards-and-sections"
              >
                {step < 3 ? "Next step" : "Continue to checkout"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

/** A sage panel of label/value rows on the review step */
function ReviewPanel({
  icon,
  title,
  rows,
}: {
  icon: ReactNode;
  title: string;
  rows: [string, string][];
}) {
  return (
    <div className="flex flex-col gap-4 rounded-md bg-secondary-accent px-5 py-6 md:px-5 md:py-12">
      <div className="flex items-center gap-4 text-primary-brand md:gap-6">
        {icon}
        <Typography variant="cardHeading" as="h3" className="font-normal text-text-charcoal">
          {title}
        </Typography>
      </div>
      <dl className="flex flex-col gap-3 md:ml-12 md:gap-4">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 md:grid-cols-2">
            <dt>
              <Typography variant="body" as="span" className="text-text-charcoal">
                {label}:
              </Typography>
            </dt>
            <dd className="min-w-0 wrap-break-word">
              <Typography variant="body" as="span" className="text-text-charcoal">
                {value}
              </Typography>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
