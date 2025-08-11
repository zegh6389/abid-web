"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

type Props = {
  src: string; // e.g. "/video/Untitled%20design.mp4"
  poster?: string;
  className?: string;
  autoPause?: boolean; // pause when out of view (default true)
  fullBleed?: boolean; // break out of containers to span the viewport
  rounded?: boolean; // control rounded corners (default true)
};

export default function AutoPlayVideo({ src, poster, className, autoPause = true, fullBleed = false, rounded = true }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

  // Ensure muted + playsInline for mobile autoplay
  el.muted = muted;
    el.playsInline = true;

    const onIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          el.play().catch(() => {/* ignore */});
        } else if (autoPause) {
          el.pause();
        }
      }
    };

    try {
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(onIntersect, { threshold: 0.35 });
        io.observe(el);
        return () => io.disconnect();
      }
    } catch {
      // ignore observer setup errors and fallback to immediate play
    }

    // Fallback: play immediately if observer unsupported
    el.play().catch(() => {/* ignore */});
    return () => {};
  }, [autoPause, muted]);

  const toggleMute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const next = !muted;
    setMuted(next);
    el.muted = next;
    if (!next) {
      el.volume = 1;
      el.play().catch(() => {/* ignore autoplay restriction after toggle */});
    }
  }, [muted]);

  const fullBleedClasses = fullBleed
    ? "w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
    : "";

  return (
    <section
      aria-label="Promo video"
      className={`${className ?? "mt-12 md:mt-16"} ${fullBleedClasses}`.trim()}
    >
      <div className="w-full relative" style={{ aspectRatio: "16 / 9" }}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          preload="metadata"
          loop
          playsInline
          muted={muted}
          className={`w-full h-full object-cover${rounded ? " rounded-2xl" : ""}`}
        />
        {/* Sound toggle */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          title={muted ? "Unmute" : "Mute"}
          className={`absolute bottom-3 right-3 glass rounded-full p-2 shadow ${rounded ? "" : ""}`}
        >
          {muted ? (
            // Volume off icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-black/80">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
              <path d="M16.5 12a4.5 4.5 0 0 1-1.318 3.182l1.06 1.06A6 6 0 0 0 18 12a6 6 0 0 0-1.758-4.243l-1.06 1.06A4.5 4.5 0 0 1 16.5 12z" opacity=".4" />
              <path d="M19.071 4.929 4.93 19.07l1.414 1.415L20.485 6.343 19.07 4.93z" />
            </svg>
          ) : (
            // Volume on icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-black/80">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
              <path d="M14.5 8.5a3.5 3.5 0 0 1 0 7v-1.5a2 2 0 1 0 0-4V8.5z" />
              <path d="M16.5 5a7 7 0 0 1 0 14v-1.5a5.5 5.5 0 0 0 0-11V5z" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
