"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Typography from "@/components/ui/typography";
import { ChevronDown } from "@/components/ui/reusable/svg";
import { countries } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { fieldBox, fieldText, FieldLabel } from "./formParts";
import { GlobeIcon } from "./registerIcons";

// "Country of residence": a searchable list of every country. Typing filters the list; pick
// with a click or the arrow keys + Enter. Only a country from the list counts, so the form
// won't move on with something made up (the browser's own "fill in this field" message shows).
export default function CountryField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (country: string) => void;
}) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // What's typed while searching (null when not searching); the chosen country is `value`
  const [typed, setTyped] = useState<string | null>(null);
  const query = typed ?? value;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Showing the chosen country (not searching yet): the whole list
    if (!q || typed === null) return countries;
    const starts = countries.filter((c) => c.toLowerCase().startsWith(q));
    const contains = countries.filter((c) => !c.toLowerCase().startsWith(q) && c.toLowerCase().includes(q));
    return [...starts, ...contains];
  }, [query, typed]);

  // Not a country from the list → the browser blocks the step with this message
  useEffect(() => {
    inputRef.current?.setCustomValidity(countries.includes(query) ? "" : "Choose your country from the list.");
  }, [query]);

  // Close when clicking elsewhere; put back the chosen country if the typing didn't pick one
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      setTyped(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option in view while using the arrow keys
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  function choose(country: string) {
    onChange(country);
    setTyped(null);
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return Math.max(0, Math.min(matches.length - 1, next));
      });
    } else if (e.key === "Enter" && open && matches[active]) {
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setTyped(null);
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-2.5 md:col-span-2 md:gap-4.5">
      <FieldLabel htmlFor={id}>Country of residence</FieldLabel>
      <div className={cn(fieldBox, "relative")}>
        <span className="shrink-0 text-secondary-accent">
          <GlobeIcon />
        </span>
        <input
          ref={inputRef}
          id={id}
          required
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          placeholder="Search for your country"
          value={query}
          onFocus={(e) => {
            setOpen(true);
            e.target.select();
          }}
          onChange={(e) => {
            setTyped(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={cn(fieldText, "pr-8")}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close country list" : "Open country list"}
          onClick={() => {
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="absolute right-4 flex size-8 cursor-pointer items-center justify-center text-primary-brand md:right-5"
        >
          <ChevronDown className={cn("size-5 transition-transform duration-300", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-[1.25rem] border border-secondary-accent bg-cards-and-sections p-2 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-4 py-3">
              <Typography variant="body" as="span" className="text-text-charcoal">
                No country matches &ldquo;{query}&rdquo;
              </Typography>
            </li>
          ) : (
            matches.map((country, index) => (
              <li
                key={country}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={country === value}
                // pointerdown so the choice lands before the input loses focus
                onPointerDown={(e) => {
                  e.preventDefault();
                  choose(country);
                }}
                onPointerMove={() => setActive(index)}
                className={cn(
                  "cursor-pointer rounded-[0.625rem] px-4 py-2.5",
                  index === active && "bg-secondary-accent/60",
                  country === value && "font-semibold",
                )}
              >
                <Typography variant="body" as="span" className="text-primary-brand">
                  {country}
                </Typography>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
