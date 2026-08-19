import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CalendarPlus, MapPin, Share2, Volume2, VolumeX } from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import divider from "@/assets/divider.png";
import { Petals } from "@/components/invitation/Petals";
import { useReveal } from "@/components/invitation/useReveal";

export const Route = createFileRoute("/")({
  component: Invitation,
  head: () => ({
    meta: [
      { title: "Tuba Shamsi & Moahd Ahsan — Wedding Invitation" },
      {
        name: "description",
        content:
          "You are cordially invited to the wedding of Tuba Shamsi & Moahd Ahsan on Tuesday, 03rd November 2026 at Paradise Banquet Hall, Dhampur Road, Nagina.",
      },
      {
        property: "og:title",
        content: "Tuba Shamsi & Moahd Ahsan — Wedding Invitation",
      },
      {
        property: "og:description",
        content:
          "Tuesday, 03rd November 2026 · Paradise Banquet Hall, Dhampur Road, Nagina.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Wedding of Tuba Shamsi & Moahd Ahsan",
          startDate: "2026-11-03T19:00:00+05:30",
          eventAttendanceMode:
            "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: "Paradise Banquet Hall",
            address: "Dhampur Road, Nagina",
          },
        }),
      },
    ],
  }),
});

const VENUE_QUERY = "Paradise Banquet Hall, Dhampur Road, Nagina";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_QUERY)}`;

const programme = [
  { label: "Arrival of Barat", time: "07 PM" },
  { label: "Dinner", time: "08 PM" },
  { label: "Nikah", time: "09 PM" },
  { label: "Rukhsati", time: "11 PM" },
];

function Ornament({ className = "" }: { className?: string }) {
  return (
    <img
      src={divider}
      alt=""
      aria-hidden
      loading="lazy"
      width={1024}
      height={512}
      className={`mx-auto h-14 w-56 object-contain opacity-80 sm:w-72 ${className}`}
    />
  );
}

function GoldButton({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 bg-card px-6 py-3 text-xs uppercase tracking-[0.22em] text-gold-deep transition-all duration-500 hover:bg-gold/10 hover:tracking-[0.3em] hover:shadow-[0_10px_30px_-14px_var(--color-gold-deep)]";
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function addToCalendar() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "SUMMARY:Wedding of Tuba Shamsi & Moahd Ahsan",
    "DTSTART:20261103T133000Z",
    "DTEND:20261103T180000Z",
    `LOCATION:${VENUE_QUERY}`,
    "DESCRIPTION:Arrival of Barat 07 PM | Dinner 08 PM | Nikah 09 PM | Rukhsati 11 PM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding-invitation.ics";
  a.click();
  URL.revokeObjectURL(url);
}

async function shareInvitation() {
  const data = {
    title: "Tuba Shamsi & Moahd Ahsan — Wedding Invitation",
    text: "You are cordially invited — Tuesday, 03rd November 2026, Paradise Banquet Hall, Nagina.",
    url: window.location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch {
      /* dismissed */
    }
  }
  await navigator.clipboard?.writeText(window.location.href);
}

function useAmbientMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (playing) {
      ctxRef.current?.close();
      ctxRef.current = null;
      setPlaying(false);
      return;
    }
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    [220, 277.18, 329.63].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const lfo = ctx.createGain();
      lfo.gain.value = 0.4 - i * 0.1;
      osc.connect(lfo).connect(gain);
      osc.start();
    });
    ctxRef.current = ctx;
    setPlaying(true);
  };

  useEffect(() => () => void ctxRef.current?.close(), []);
  return { playing, toggle };
}

function Invitation() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const { playing, toggle } = useAmbientMusic();
  useReveal(opened);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const openInvitation = () => {
    setOpened(true);
    requestAnimationFrame(() =>
      document
        .getElementById("invitation")
        ?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
        <div className="h-20 w-20 animate-spin [animation-duration:2.4s] rounded-full border border-gold/50 border-t-gold" />
        <p className="font-display text-sm uppercase tracking-[0.4em] text-gold-deep">
          Bismillah
        </p>
      </div>
    );
  }

  return (
    <main className="relative overflow-x-hidden">
      <Petals />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute music" : "Play music"}
        className="fixed right-4 top-4 z-30 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/60 bg-card/90 text-gold-deep backdrop-blur transition-colors hover:bg-gold/10"
      >
        {playing ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </button>

      {/* Hero */}
      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-5 py-20 text-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/45" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="animate-soft-fade font-display text-base italic text-ink/80 sm:text-lg">
            In the name of "ALLAH" the most beneficent and the most merciful
          </p>
          <Ornament className="my-6" />
          <h1 className="animate-reveal font-script text-6xl leading-[1.05] text-gold-gradient sm:text-8xl">
            Tuba Shamsi
          </h1>
          <p className="my-4 animate-reveal font-display text-lg uppercase tracking-[0.5em] text-ink/70 [animation-delay:200ms]">
            Weds
          </p>
          <p className="animate-reveal font-script text-6xl leading-[1.05] text-gold-gradient [animation-delay:350ms] sm:text-8xl">
            Moahd Ahsan
          </p>
          <p className="mt-8 animate-reveal font-display text-base tracking-[0.25em] text-ink/75 [animation-delay:500ms]">
            TUESDAY, 03RD NOVEMBER 2026
          </p>
          <div className="mt-10 animate-reveal [animation-delay:650ms]">
            <GoldButton onClick={openInvitation}>Open Invitation</GoldButton>
          </div>
        </div>
      </section>

      {opened && (
        <>
          {/* The Invitation */}
          <section
            id="invitation"
            className="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center sm:py-28"
          >
            <div className="reveal-on-scroll card-ornate rounded-sm px-6 py-12 sm:px-12">
              <p className="font-display text-lg italic text-ink/80">
                With the blessings and loving memories of
              </p>
              <p className="mt-2 font-display text-2xl text-gold-deep sm:text-3xl">
                Late Mr. Habib ur Rehman,
              </p>
              <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-7 text-muted-foreground sm:text-base">
                we request the honour of your gracious presence and blessings on
                the auspicious occasion of the marriage of his beloved
                granddaughter,
              </p>

              <Ornament className="my-8" />

              <h2 className="font-script text-5xl text-gold-gradient sm:text-7xl">
                Tuba Shamsi
              </h2>
              <p className="mt-3 font-display text-base tracking-widest text-ink/75">
                D/o Mr. Shafi ur Rehman
              </p>

              <p className="my-8 font-display text-base uppercase tracking-[0.5em] text-gold-deep">
                Weds
              </p>

              <h2 className="font-script text-5xl text-gold-gradient sm:text-7xl">
                Moahd Ahsan
              </h2>
              <p className="mt-3 font-display text-base tracking-widest text-ink/75">
                S/o Mr. Imran Ahmad
              </p>
              <p className="mt-1 font-display text-base tracking-widest text-ink/75">
                R/o Azad Colony, Sahranpur (U.P.)
              </p>

              <div className="gold-line mx-auto my-10 h-px w-2/3" />

              <p className="mx-auto max-w-xl font-display text-lg italic leading-8 text-ink/85">
                Please grace the occasion with your presence and blessings and
                make this moment a cherished memory for the entire family.
              </p>
            </div>
          </section>

          {/* Programme */}
          <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20 text-center sm:pb-28">
            <h2 className="reveal-on-scroll font-display text-4xl tracking-[0.2em] text-gold-deep sm:text-5xl">
              Programme
            </h2>
            <p className="reveal-on-scroll mt-4 font-display text-lg text-ink/80">
              On Tuesday, 03rd November 2026
            </p>
            <Ornament className="my-8" />

            <ol className="mx-auto max-w-md space-y-4 text-left">
              {programme.map((item) => (
                <li
                  key={item.label}
                  className="reveal-on-scroll card-ornate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-sm px-5 py-5"
                >
                  <span className="min-w-0 truncate font-display text-xl text-ink sm:text-2xl">
                    {item.label}
                  </span>
                  <span className="shrink-0 font-body text-sm tracking-[0.2em] text-gold-deep">
                    {item.time}
                  </span>
                </li>
              ))}
            </ol>

            <p className="reveal-on-scroll mt-10 font-display text-xl uppercase tracking-[0.4em] text-gold-deep">
              Insha-Allah
            </p>
          </section>

          {/* Venue */}
          <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20 text-center sm:pb-28">
            <div className="reveal-on-scroll card-ornate rounded-sm px-6 py-12">
              <p className="font-body text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Venue
              </p>
              <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
                Paradise Banquet Hall
              </h2>
              <p className="mt-2 font-display text-lg text-ink/75">
                Dhampur Road, Nagina
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <GoldButton href={MAPS_URL}>
                  <MapPin size={15} /> Get Directions
                </GoldButton>
                <GoldButton onClick={addToCalendar}>
                  <CalendarPlus size={15} /> Add to Calendar
                </GoldButton>
                <GoldButton onClick={shareInvitation}>
                  <Share2 size={15} /> Share Invitation
                </GoldButton>
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20 text-center sm:pb-28">
            <p className="reveal-on-scroll font-display text-xl tracking-[0.3em] text-gold-deep">
              R.S.V.P.:
            </p>
            <p className="reveal-on-scroll mt-4 font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              All Relatives
              <br />
              and Friends
            </p>
            <div className="reveal-on-scroll mt-10">
              <GoldButton href={MAPS_URL}>You Are Cordially Invited</GoldButton>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative z-10 border-t border-gold/40 px-5 py-16 text-center">
            <Ornament className="mb-6" />
            <p className="font-display text-lg italic text-ink/80">
              Respectfully Yours,
            </p>
            <p className="mt-2 font-display text-2xl text-gold-deep">
              The Entire Family
            </p>
            <p className="font-display text-xl text-ink/80">
              of Late Mr. Habib ur Rehman
            </p>
            <p className="mx-auto mt-6 max-w-sm font-body text-sm leading-7 text-muted-foreground">
              R/o Moh. Panjabiyan, Near Jaman
              <br />
              Wali Masjid Nagina Distt. Bijnor
            </p>
            <p className="mt-4 font-body text-sm tracking-wider text-ink/80">
              Mob.:{" "}
              <a href="tel:9897653118" className="hover:text-gold-deep">
                9897653118
              </a>
              ,{" "}
              <a href="tel:9068119926" className="hover:text-gold-deep">
                9068119926
              </a>
            </p>
          </footer>
        </>
      )}
    </main>
  );
}
