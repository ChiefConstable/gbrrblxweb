"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  title: string;
  body: string;
  image: string;
  href: string;
};

const SLIDES: Slide[] = [
  {
    title: "Train Crew",
    body:
      "Drivers and guards are the face of every service. You'll learn the routes, follow the timetable, handle station stops and keep passengers informed from the first departure to the last arrival of the session.",
    image: "/media/function-train-crew.jpg",
    href: "/jobs?division=train-crew",
  },
  {
    title: "Stations",
    body:
      "Our station teams welcome passengers, dispatch trains safely and keep platforms running smoothly during peak events. It's the perfect starting point if you enjoy helping others and being at the heart of the action.",
    image: "/media/function-stations.jpg",
    href: "/jobs?division=stations",
  },
  {
    title: "Control & Operations",
    body:
      "Signallers and controllers see the whole network at once. You'll set routes, manage delays and make quick decisions that keep dozens of trains moving safely across the map.",
    image: "/media/function-control.jpg",
    href: "/jobs?division=control-operations",
  },
  {
    title: "Engineering",
    body:
      "Our engineers build and maintain the game itself, from new stations and track layouts to scripting the systems our crews rely on. Bring your Roblox Studio skills and help shape the railway's future.",
    image: "/media/function-engineering.jpg",
    href: "/jobs?division=engineering",
  },
  {
    title: "Head Office",
    body:
      "HR, recruitment, community management and events all live here. Head Office keeps the community organised, welcoming and fair, and makes sure every new member gets the support they need.",
    image: "/media/function-head-office.jpg",
    href: "/jobs?division=head-office",
  },
];

export default function FunctionsCarousel() {
  const [index, setIndex] = useState(0);
  const count = SLIDES.length;

  const go = (next: number) => setIndex((next + count) % count);

  return (
    <section id="functions" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-20" aria-roledescription="carousel" aria-label="Our Functions">
      <h2 className="text-center text-3xl sm:text-4xl">Our Functions</h2>

      <div className="relative mt-10">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.title}
                className="w-full shrink-0 px-2 sm:px-16"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${slide.title}`}
                aria-hidden={i !== index}
              >
                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-gray-200">
                    <Image
                      src={slide.image}
                      alt={`${slide.title} at GBR`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl">{slide.title}</h3>
                    <p className="mt-4 leading-8">{slide.body}</p>
                    <Link
                      href={slide.href}
                      tabIndex={i === index ? 0 : -1}
                      className="btn-pill-sm mt-6"
                    >
                      View Roles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous function"
          className="btn-circle absolute left-0 top-[35%] -translate-y-1/2 md:top-1/2"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next function"
          className="btn-circle absolute right-0 top-[35%] -translate-y-1/2 md:top-1/2"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-1">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${slide.title}`}
            aria-current={i === index}
            className="group flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`h-3 w-3 rounded-full transition-colors ${
                i === index ? "bg-brand-green" : "bg-gray-300 group-hover:bg-gray-400"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
