import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarPlus, Loader2, MapPin, Share2, Volume2, VolumeX } from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import divider from "@/assets/divider.png";
import botanical from "@/assets/botanical.png";
import paper from "@/assets/paper-texture.jpg";
import { Petals } from "@/components/invitation/Petals";
import { Countdown } from "@/components/invitation/Countdown";
import { OpeningEnvelope } from "@/components/invitation/OpeningEnvelope";
import { useReveal } from "@/components/invitation/useReveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Invitation,
  head: () => ({
    meta: [
      { title: "Tuba Shamsi & Mohd Ahsan — Wedding Invitation" },
      {
        name: "description",
        content:
          "You are cordially invited to the wedding of Tuba Shamsi & Mohd Ahsan on Tuesday, 03rd November 2026 at Paradise Banquet Hall, Dhampur Road, Nagina.",
      },
      {
        property: "og:title",
        content: "Tuba Shamsi & Mohd Ahsan — Wedding Invitation",
      },
      {
        property: "og:description",
        content:
          "Tuesday, 03rd November 2026 · Paradise Banquet Hall, Dhampur Road, Nagina.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Wedding of Tuba Shamsi & Mohd Ahsan",
          startDate: "2026-11-03T19:00:00+05:30",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
      className={`mx-auto h-12 w-48 object-contain opacity-70 sm:w-64 ${className}`}
    />
  );
}

function Botanical({ className = "" }: { className?: string }) {
  return (
    <img
      src={botanical}
      alt=""
      aria-hidden
      loading="lazy"
      width={1408}
      height={704}
      className={`pointer-events-none select-none object-contain ${className}`}
    />
  );
}

function SectionTitle({
  overline,
  title,
}: {
  overline: string;
  title: string;
}) {
  return (
    <div className="reveal-on-scroll">
      <p className="font-body text-[0.6rem] uppercase tracking-[0.55em] text-sage-deep/80">
        {overline}
      </p>
      <h2 className="mt-3 font-display text-3xl tracking-[0.12em] text-ink sm:text-5xl">
        {title}
      </h2>
      <div className="gold-line mx-auto mt-5 h-px w-24" />
    </div>
  );
}

function GoldButton({
  children,
  onClick,
  href,
  solid = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  solid?: boolean;
}) {
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-body text-[0.65rem] uppercase tracking-[0.28em] transition-all duration-500 ${
    solid
      ? "bg-sage-deep text-background hover:bg-ink hover:tracking-[0.34em]"
      : "border border-gold/55 bg-card/70 text-gold-deep backdrop-blur-sm hover:border-gold hover:bg-gold/10 hover:tracking-[0.34em]"
  } hover:shadow-[0_14px_36px_-18px_var(--color-gold-deep)]`;
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  return (
    <Button type="button" variant="ghost" onClick={onClick} className={cls}>
      {children}
    </Button>
  );
}

function addToCalendar() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "SUMMARY:Wedding of Tuba Shamsi & Mohd Ahsan",
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
    title: "Tuba Shamsi & Mohd Ahsan — Wedding Invitation",
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

const MUSIC_URL = "/api/public/music";

function useAmbientMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);

  const ensureAudio = async () => {
    if (audioRef.current) return audioRef.current;
    if (fetchingRef.current) {
      // Wait briefly for the in-flight fetch to finish
      while (fetchingRef.current) {
        await new Promise((r) => setTimeout(r, 50));
      }
      return audioRef.current!;
    }
    fetchingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(MUSIC_URL);
      if (!res.ok) throw new Error(`Music request failed: ${res.status}`);
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.loop = true;
      audio.volume = 0.45;
      audioRef.current = audio;
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
    return audioRef.current!;
  };

  const play = useCallback(async () => {
    if (audioRef.current && !audioRef.current.paused) return;
    try {
      const audio = await ensureAudio();
      await audio.play();
      setPlaying(true);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggle = async () => {
    if (loading) return;
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    await play();
  };

  useEffect(() => () => void audioRef.current?.pause(), []);
  return { playing, loading, toggle, play };
}

function Invitation() {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const { playing, loading, toggle, play } = useAmbientMusic();
  useReveal(opened);

  const openInvitation = () => {
    if (opening || opened) return;
    setOpening(true);
    window.setTimeout(() => {
      setOpened(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 1100);
  };

  useEffect(() => {
    if (opened) {
      play();
    }
  }, [opened, play]);

  return (
    <main
      className={`paper-grain relative overflow-x-hidden ${opened ? "invitation-revealed" : "h-[100svh] overflow-hidden"}`}
      style={{ ["--paper-url" as string]: `url(${paper})` }}
    >
      {!opened && <OpeningEnvelope opening={opening} onOpen={openInvitation} />}
      {opened && <Petals />}

      {opened && <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={playing ? "Mute music" : "Play music"}
        className="fixed right-4 top-4 z-30 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-card/85 text-gold-deep shadow-sm backdrop-blur transition-colors hover:bg-gold/10"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : playing ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </Button>}

      {/* Hero */}
      {opened && <section className="hero-unveil relative flex min-h-[94svh] items-center justify-center px-4 py-12 sm:py-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-background/55" />

        <div className="relative z-10 mx-auto w-full max-w-xl">
          <div className="arch-frame invitation-border animate-reveal border border-gold/45 bg-card/70 px-6 py-12 text-center shadow-[0_40px_90px_-60px_var(--color-gold-deep)] backdrop-blur-[2px] sm:px-12 sm:py-16">
            <p className="font-display text-sm italic leading-relaxed text-ink/75 sm:text-base">
              In the name of "ALLAH" the most beneficent and the most merciful
            </p>

            <Ornament className="my-5" />

            <h1 className="font-script text-[3.25rem] leading-[1.05] text-shimmer sm:text-7xl">
              Tuba Shamsi
              <span className="my-3 block font-display text-sm uppercase tracking-[0.55em] text-sage-deep">
                Weds
              </span>
              <span className="block">Mohd Ahsan</span>
            </h1>

            <div className="gold-line mx-auto my-7 h-px w-2/3" />

            <p className="font-body text-[0.62rem] uppercase tracking-[0.4em] text-ink/70">
              Tuesday · 03 November 2026
            </p>
            <p className="mt-2 font-display text-base text-ink/70">
              Paradise Banquet Hall, Nagina
            </p>

            <p className="mt-7 font-body text-[0.55rem] uppercase tracking-[0.38em] text-gold-deep">
              Scroll to celebrate with us
            </p>
          </div>

          <Botanical className="animate-drift mx-auto -mt-6 w-56 opacity-90 sm:w-72" />
        </div>
      </section>}

      {opened && (
        <>
          {/* The Invitation */}
          <section
            id="invitation"
            className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:py-28"
          >
            <SectionTitle overline="With Gratitude" title="The Invitation" />

            <div className="reveal-on-scroll card-ornate relative mt-12 overflow-hidden rounded-sm px-5 py-14 sm:px-14">
              <Botanical className="absolute -left-16 -top-10 w-52 rotate-12 opacity-25" />
              <Botanical className="absolute -bottom-12 -right-16 w-52 -rotate-12 opacity-25" />

              <div className="relative">
                <p className="font-display text-lg italic text-ink/80">
                  With the blessings and loving memories of
                </p>
                <p className="mt-2 font-display text-2xl text-gold-deep sm:text-3xl">
                  Late Mr. Habib ur Rehman,
                </p>
                <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-8 text-muted-foreground">
                  we request the honour of your gracious presence and blessings
                  on the auspicious occasion of the marriage of his beloved
                  granddaughter,
                </p>

                <Ornament className="my-9" />

                <h3 className="font-script text-5xl text-shimmer sm:text-7xl">
                  Tuba Shamsi
                </h3>
                <p className="mt-3 font-display text-base tracking-[0.2em] text-ink/75">
                  D/o Mr. Shafi ur Rehman
                </p>

                <div className="my-8 flex items-center justify-center gap-4">
                  <span className="gold-line h-px w-16" />
                  <span className="font-display text-sm uppercase tracking-[0.45em] text-sage-deep">
                    Weds
                  </span>
                  <span className="gold-line h-px w-16" />
                </div>

                <h3 className="font-script text-5xl text-shimmer sm:text-7xl">
                  Mohd Ahsan
                </h3>
                <p className="mt-3 font-display text-base tracking-[0.2em] text-ink/75">
                  S/o Mr. Imran Ahmad
                </p>
                <p className="mt-1 font-display text-base tracking-[0.2em] text-ink/75">
                  R/o Azad Colony, Sahranpur (U.P.)
                </p>

                <div className="gold-line mx-auto my-10 h-px w-2/3" />

                <p className="mx-auto max-w-xl font-display text-lg italic leading-8 text-ink/85">
                  Please grace the occasion with your presence and blessings and
                  make this moment a cherished memory for the entire family.
                </p>
              </div>
            </div>
          </section>

          {/* Countdown */}
          <section className="relative z-10 mx-auto max-w-3xl px-4 pb-20 text-center sm:pb-28">
            <p className="reveal-on-scroll font-body text-[0.6rem] uppercase tracking-[0.5em] text-sage-deep/80">
              Counting the days
            </p>
            <div className="reveal-on-scroll mt-6">
              <Countdown />
            </div>
          </section>

          {/* Programme */}
          <section className="relative z-10 mx-auto max-w-3xl px-4 pb-20 text-center sm:pb-28">
            <SectionTitle overline="The Celebration" title="Programme" />
            <p className="reveal-on-scroll mt-6 font-display text-lg text-ink/80">
              On Tuesday, 03rd November 2026
            </p>

            <ol className="relative mx-auto mt-12 max-w-md space-y-4 text-left">
              <span
                aria-hidden
                className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-gold/35"
              />
              {programme.map((item, i) => (
                <li
                  key={item.label}
                  className="reveal-on-scroll relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-sm border border-gold/35 bg-card/80 px-4 py-5 backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_18px_40px_-28px_var(--color-gold-deep)]"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-background font-display text-base text-gold-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 truncate font-display text-xl text-ink sm:text-2xl">
                    {item.label}
                  </span>
                  <span className="shrink-0 font-body text-xs tracking-[0.2em] text-sage-deep">
                    {item.time}
                  </span>
                </li>
              ))}
            </ol>

            <p className="reveal-on-scroll mt-12 font-display text-xl uppercase tracking-[0.45em] text-gold-deep">
              Insha-Allah
            </p>
          </section>

          {/* Venue */}
          <section className="relative z-10 mx-auto max-w-3xl px-4 pb-20 text-center sm:pb-28">
            <div className="reveal-on-scroll arch-frame relative overflow-hidden border border-gold/45 bg-card/80 px-5 py-16 backdrop-blur-sm sm:px-12">
              <Botanical className="absolute -bottom-10 left-1/2 w-72 -translate-x-1/2 opacity-25" />
              <div className="relative">
                <p className="font-body text-[0.6rem] uppercase tracking-[0.5em] text-sage-deep/80">
                  Venue
                </p>
                <h2 className="mt-4 font-display text-3xl text-ink sm:text-5xl">
                  Paradise Banquet Hall
                </h2>
                <p className="mt-2 font-display text-lg text-ink/70">
                  Dhampur Road, Nagina
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <GoldButton href={MAPS_URL} solid>
                    <MapPin size={14} /> Get Directions
                  </GoldButton>
                  <GoldButton onClick={addToCalendar}>
                    <CalendarPlus size={14} /> Add to Calendar
                  </GoldButton>
                  <GoldButton onClick={shareInvitation}>
                    <Share2 size={14} /> Share Invitation
                  </GoldButton>
                </div>
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section className="relative z-10 mx-auto max-w-3xl px-4 pb-20 text-center sm:pb-28">
            <SectionTitle overline="Kindly Respond" title="R.S.V.P.:" />
            <p className="reveal-on-scroll mt-8 font-display text-2xl leading-relaxed text-ink sm:text-3xl">
              All Relatives
              <br />
              and Friends
            </p>
            <div className="reveal-on-scroll mt-10">
              <GoldButton onClick={shareInvitation}>
                You Are Cordially Invited
              </GoldButton>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative z-10 border-t border-gold/35 px-4 py-16 text-center">
            <Ornament className="mb-6" />
            <p className="font-display text-lg italic text-ink/75">
              Respectfully Yours,
            </p>
            <p className="mt-2 font-display text-2xl text-gold-deep">
              The Entire Family
            </p>
            <p className="font-display text-xl text-ink/75">
              of Late Mr. Habib ur Rehman
            </p>
            <p className="mx-auto mt-6 max-w-sm font-body text-sm leading-7 text-muted-foreground">
              R/o Moh. Panjabiyan, Near Jaman
              <br />
              Wali Masjid Nagina Distt. Bijnor
            </p>
            <p className="mt-4 font-body text-sm tracking-wider text-ink/80">
              Mob.:{" "}
              <a href="tel:9897695318" className="hover:text-gold-deep">
                9897695318
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
