import { useEffect, useState } from "react";

const TARGET = new Date("2026-11-03T19:00:00+05:30").getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  return {
    Days: Math.floor(ms / 86400000),
    Hours: Math.floor(ms / 3600000) % 24,
    Minutes: Math.floor(ms / 60000) % 60,
    Seconds: Math.floor(ms / 1000) % 60,
  };
}

export function Countdown() {
  const [t, setT] = useState(diff);

  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-4">
      {Object.entries(t).map(([label, value]) => (
        <div
          key={label}
          className="rounded-sm border border-gold/35 bg-card/70 px-1 py-4 backdrop-blur-sm"
        >
          <p className="font-display text-2xl text-gold-deep sm:text-4xl">
            {String(value).padStart(2, "0")}
          </p>
          <p className="mt-1 font-body text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.65rem]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
