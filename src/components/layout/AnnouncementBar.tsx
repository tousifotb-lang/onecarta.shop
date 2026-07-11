"use client";

import { useState, useEffect } from "react";

interface AnnouncementSettings {
  isActive: boolean;
  text: string;
}

export default function AnnouncementBar() {
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings/announcement")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => setSettings({ isActive: false, text: "" }));
  }, []);

  // Settings load hocche, admin off kore rekhese, othoba text khali — tinta
  // khetreই strip-ta render hobe na, navbar age-er moto thik same thakbe.
  if (!settings || !settings.isActive || !settings.text.trim()) {
    return null;
  }

  return (
    <div className="w-full bg-[#e63946] text-white overflow-hidden py-1.5 select-none">
      <div className="flex w-max animate-announcement-marquee">
        <span className="whitespace-nowrap px-8 text-[11px] sm:text-xs font-bold tracking-wide">
          {settings.text}
        </span>
        <span aria-hidden="true" className="whitespace-nowrap px-8 text-[11px] sm:text-xs font-bold tracking-wide">
          {settings.text}
        </span>
      </div>

      <style jsx>{`
        @keyframes announcement-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-announcement-marquee {
          animation: announcement-marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}