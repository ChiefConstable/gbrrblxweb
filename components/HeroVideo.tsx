"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) void video.play().catch(() => {});
  };

  return (
    <section className="relative h-[100svh] min-h-[480px] w-full overflow-hidden bg-brand-dark" aria-label="Welcome video">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/hero.mp4"
        poster="/media/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Subtle gradient for legibility of controls */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        className="absolute right-6 top-24 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:right-10"
      >
        {muted ? <VolumeX size={26} aria-hidden="true" /> : <Volume2 size={26} aria-hidden="true" />}
      </button>

      <div className="absolute bottom-16 left-6 sm:bottom-20 sm:left-[20%]">
        <Link href="/jobs" className="btn-pill px-10 py-4 text-base shadow-lg sm:text-lg">
          View All GBR Vacancies
        </Link>
      </div>
    </section>
  );
}
