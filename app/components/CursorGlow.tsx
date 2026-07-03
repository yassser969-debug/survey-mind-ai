"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], summary, label, [data-cursor='pointer']";

const TEXT_FIELD_SELECTOR =
  "input, textarea, select, [contenteditable='true']";

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (finePointer.matches && !reducedMotion.matches) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const spotlight = spotlightRef.current;
    if (!dot || !ring || !spotlight) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let spotX = x;
    let spotY = y;
    let frame = 0;

    const setState = (className: string, on: boolean) => {
      dot.classList.toggle(className, on);
      ring.classList.toggle(className, on);
    };

    const onMouseMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;

      setState("cursor-hidden", false);

      const target =
        event.target instanceof Element ? event.target : null;
      const overTextField = !!target?.closest(TEXT_FIELD_SELECTOR);
      const overInteractive =
        !overTextField && !!target?.closest(INTERACTIVE_SELECTOR);

      setState("cursor-on-text", overTextField);
      setState("cursor-on-link", overInteractive);
    };

    const onMouseDown = () => setState("cursor-down", true);
    const onMouseUp = () => setState("cursor-down", false);
    const onMouseLeave = () => setState("cursor-hidden", true);

    const tick = () => {
      // The ring and spotlight trail the pointer with a soft lag.
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      spotX += (x - spotX) * 0.09;
      spotY += (y - spotY) * 0.09;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      spotlight.style.setProperty("--spot-x", `${spotX}px`);
      spotlight.style.setProperty("--spot-y", `${spotY}px`);

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    root.addEventListener("mouseleave", onMouseLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      root.removeEventListener("mouseleave", onMouseLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={spotlightRef} className="cursor-spotlight" aria-hidden />
      <div ref={ringRef} className="cursor-ring cursor-hidden" aria-hidden>
        <span className="cursor-ring-core" />
      </div>
      <div ref={dotRef} className="cursor-dot cursor-hidden" aria-hidden>
        <span className="cursor-dot-core" />
      </div>
    </>
  );
}
