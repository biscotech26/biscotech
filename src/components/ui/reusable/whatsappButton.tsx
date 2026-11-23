"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { siteConfig } from "@/lib/seo";

// Keep this far from the screen edges, in px
const EDGE = 12;
// Moving less than this is a tap (opens WhatsApp), more is a drag
const DRAG_THRESHOLD = 6;
const STORAGE_KEY = "biscotech-whatsapp-position";

type Position = { left: number; top: number };

function clamp(pos: Position, size: number): Position {
  return {
    left: Math.min(Math.max(pos.left, EDGE), window.innerWidth - size - EDGE),
    top: Math.min(Math.max(pos.top, EDGE), window.innerHeight - size - EDGE),
  };
}

// A round deep-teal WhatsApp button fixed on every page (bottom right to start). Tap it to
// open a chat with BiscoTech; drag it anywhere on the screen if it's in the way. The spot it's
// dropped in is remembered for the visitor's next page.
export default function WhatsAppButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  // null = the default corner (set in CSS), until the visitor moves it
  const [position, setPosition] = useState<Position | null>(null);
  const drag = useRef<{ x: number; y: number; start: Position; moved: boolean } | null>(null);
  const justDragged = useRef(false);

  // Put it back where the visitor left it last time, and keep it on screen when the window
  // resizes or the phone rotates
  useEffect(() => {
    const size = ref.current?.offsetWidth ?? 56;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPosition(clamp(JSON.parse(saved) as Position, size));
    } catch {
      // Storage blocked: start in the default corner
    }
    const onResize = () => setPosition((p) => (p ? clamp(p, size) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function onPointerDown(e: PointerEvent<HTMLAnchorElement>) {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = { x: e.clientX, y: e.clientY, start: { left: rect.left, top: rect.top }, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLAnchorElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    d.moved = true;
    setPosition(clamp({ left: d.start.left + dx, top: d.start.top + dy }, e.currentTarget.offsetWidth));
  }

  function onPointerUp(e: PointerEvent<HTMLAnchorElement>) {
    const d = drag.current;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (!d?.moved) return;
    // A drag ends with a click event; this stops it opening WhatsApp
    justDragged.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
    } catch {
      // Storage blocked: it just won't be remembered
    }
  }

  return (
    <a
      ref={ref}
      href={siteConfig.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BiscoTech on WhatsApp"
      title="Chat with us on WhatsApp (drag to move)"
      draggable={false}
      onClick={(e) => {
        if (justDragged.current) {
          e.preventDefault();
          justDragged.current = false;
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={position ?? undefined}
      // touch-none: dragging on a phone moves the button instead of scrolling the page
      className={`fixed z-50 flex size-14 cursor-grab print:hidden touch-none items-center justify-center rounded-full bg-primary-brand text-cards-and-sections shadow-[0_0.75rem_1.75rem_-0.5rem_rgba(18,63,58,0.6)] transition-[scale,box-shadow] duration-300 select-none hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-teal active:cursor-grabbing md:size-15 ${position ? "" : "right-5 bottom-5 md:right-8 md:bottom-8"}`}
    >
      {/* WhatsApp logo */}
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 md:size-8" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    </a>
  );
}
