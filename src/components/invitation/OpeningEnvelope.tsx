import { Button } from "@/components/ui/button";

interface OpeningEnvelopeProps {
  opening: boolean;
  onOpen: () => void;
}

export function OpeningEnvelope({ opening, onOpen }: OpeningEnvelopeProps) {
  return (
    <div
      className={`invitation-gate ${opening ? "is-opening" : ""}`}
      aria-hidden={opening}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,var(--color-gold)_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-5 text-center">
        <p className="mb-8 font-body text-[0.58rem] uppercase tracking-[0.45em] text-gold/80 sm:text-xs">
          A wedding invitation
        </p>

        <div className="envelope-scene w-full">
          <div className="envelope-shadow" />
          <div className="envelope">
            <div className="envelope-back" />
            <div className="envelope-letter">
              <p className="font-body text-[0.48rem] uppercase tracking-[0.38em] text-sage-deep/70">
                The wedding of
              </p>
              <p className="mt-2 font-script text-3xl text-gold-deep">
                Tuba &amp; Mohd
              </p>
            </div>
            <div className="envelope-flap" />
            <div className="envelope-left" />
            <div className="envelope-right" />
            <div className="envelope-front" />

            <Button
              type="button"
              variant="ghost"
              onClick={onOpen}
              disabled={opening}
              aria-label="Open the wedding invitation"
              className="wax-seal h-20 w-20 rounded-full p-0 text-primary-foreground hover:bg-wax hover:text-primary-foreground"
            >
              <span className="wax-seal-ring" aria-hidden />
              <span className="relative font-display text-2xl italic">T&amp;M</span>
            </Button>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onOpen}
          disabled={opening}
          className="mt-10 h-auto rounded-none border-b border-gold/40 px-2 py-2 font-body text-[0.6rem] uppercase tracking-[0.4em] text-gold transition-colors hover:bg-transparent hover:text-primary-foreground"
        >
          Tap the seal to open
        </Button>
      </div>
    </div>
  );
}