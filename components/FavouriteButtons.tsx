"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

const KEY = "gbr-favourite-jobs";

function readFavourites(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeFavourites(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage unavailable (private window etc.): favourites just won't persist
  }
}

export default function FavouriteButtons({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const list = readFavourites();
    setSaved(list.includes(slug));
    setCount(list.length);
  }, [slug]);

  const toggle = () => {
    const list = readFavourites();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    writeFavourites(next);
    setSaved(next.includes(slug));
    setCount(next.length);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-1.5 text-[11px] font-bold text-white transition hover:bg-brand-greenDark"
      >
        <Star size={12} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
        {saved ? "Saved to Favourites" : "Add to Favourites"}
      </button>
      <Link
        href="/jobs?favourites=1"
        className="inline-flex items-center gap-1.5 rounded-full border border-brand-green px-4 py-1.5 text-[11px] font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
      >
        <Heart size={12} aria-hidden="true" />
        View Favourites{count > 0 ? ` (${count})` : ""}
      </Link>
    </div>
  );
}
