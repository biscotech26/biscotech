// Icons for the registration flow (Figma: Akar, Ant Design and Clarity line icons). They take
// the text colour around them (currentColor) and are 24px unless a class says otherwise.

type IconProps = { className?: string };

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MailIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" {...line} />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" {...line} />
    </svg>
  );
}

export function PhoneIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M4.5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 5.4 5.4l1.3-2 4 1.6v3.2a2 2 0 0 1-2 2A15.5 15.5 0 0 1 2.5 6a2 2 0 0 1 2-2Z"
        {...line}
      />
    </svg>
  );
}

export function GlobeIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...line} />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" {...line} />
    </svg>
  );
}

export function BookIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Zm0 0v13" {...line} />
    </svg>
  );
}

export function LaptopIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4.5" y="5" width="15" height="10.5" rx="1" {...line} />
      <path d="M2.5 18.5h19" {...line} />
    </svg>
  );
}

export function HomeIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3.5 11 12 4l8.5 7v9h-6v-5.5h-5V20h-6v-9Z" {...line} />
    </svg>
  );
}

export function StarBadgeIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" {...line} />
    </svg>
  );
}

export function CheckIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" {...line} strokeWidth={2} />
    </svg>
  );
}

export function InfoIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="currentColor" />
      <path d="M12 7v6.5M12 16.5v.5" stroke="var(--color-primary-brand, #123f3a)" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function CardIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" {...line} />
      <path d="M3 10h18M6.5 14.5h3" {...line} />
    </svg>
  );
}

export function ShieldIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6l-7-2.5Z" {...line} />
      <path d="m9 12 2 2 4-4" {...line} />
    </svg>
  );
}

export function CapIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 5 2 9.5 12 14l10-4.5L12 5Z" fill="currentColor" />
      <path d="M6 11.5V16c1.6 1.5 3.6 2.2 6 2.2s4.4-.7 6-2.2v-4.5L12 14l-6-2.5Z" fill="currentColor" />
    </svg>
  );
}

export function UserIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="7.5" r="4" fill="currentColor" />
      <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5H4Z" fill="currentColor" />
    </svg>
  );
}

export function BankIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2.5 2.5 8v2h19V8L12 2.5ZM4 11.5h2.5v7H4v-7Zm4.5 0H11v7H8.5v-7Zm4.5 0h2.5v7H13v-7Zm4.5 0H20v7h-2.5v-7ZM2.5 20h19v2h-19v-2Z" fill="currentColor" />
    </svg>
  );
}

/** Figma's big round profile mark beside each step's heading */
export function ProfileCircleIcon({ className = "size-20" }: IconProps) {
  return (
    <svg viewBox="0 0 113 113" className={className} aria-hidden="true">
      <circle cx="56.5" cy="56.5" r="52" fill="none" stroke="currentColor" strokeWidth="7" />
      <circle cx="56.5" cy="44" r="16" fill="currentColor" />
      <path d="M24 92c6-14 18.5-21 32.5-21S83 78 89 92c-9 8-20 12.5-32.5 12.5S33 100 24 92Z" fill="currentColor" />
    </svg>
  );
}

/** Figma's filled check mark beside "Review and confirm" */
export function CheckCircleFilledIcon({ className = "size-14" }: IconProps) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="currentColor" />
      <path d="m16 28.5 8 8 16-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
