"use client";

import { useState, useEffect } from "react";

interface AnnouncementBarProps {
  messages: string[];
}

export default function AnnouncementBar({ messages }: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Admin notun kore save korle (message list update hoile) index reset kora hocche,
  // nahole stale index-e crash/blank dekhanor risk thake.
  useEffect(() => {
    setCurrentIndex(0);
    setVisible(true);
  }, [messages.join("|")]);

  if (messages.length === 0) return null;

  const currentMessage = messages[currentIndex % messages.length] || "";
  // Lomba message-er jonno ektu beshi shomoy, chotota-r jonno kom — porar gôti motamuti
  // ekrokom rakhar jonno (fixed duration hole lomba text tarataributi cross hoye jeto)
  const duration = Math.min(22, Math.max(9, currentMessage.length * 0.16));

  const handleAnimationEnd = () => {
    // Line-ta pura screen theke berie jawar por samanno biroti, tarpor porer message dhoke —
    // ekta-r shathe arekta overlap kore na.
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
      setVisible(true);
    }, 450);
  };

  return (
    <div className="w-full bg-[#e63946] text-white overflow-hidden h-8 flex items-center select-none">
      {visible && (
        <span
          key={currentIndex}
          onAnimationEnd={handleAnimationEnd}
          style={{ animationDuration: `${duration}s` }}
          className="whitespace-nowrap text-[15px] sm:text-xs font-bold tracking-wide announcement-slide"
        >
          {currentMessage}
        </span>
      )}

      <style jsx>{`
        @keyframes announcement-slide-anim {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .announcement-slide {
          animation-name: announcement-slide-anim;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}