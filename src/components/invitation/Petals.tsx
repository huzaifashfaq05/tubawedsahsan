const petals = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 7.3 + 3) % 100,
  delay: (i * 1.7) % 14,
  duration: 16 + ((i * 3) % 12),
  size: 5 + ((i * 2) % 7),
}));

export function Petals() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-10vh] rounded-full bg-gold/50"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `float-petal ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
