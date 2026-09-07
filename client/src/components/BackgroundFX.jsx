// Drifting pixel motes. Fixed values (not random) so the layout is stable
// across renders and every viewer sees the same composition.
const MOTES = [
  { left: '6%', size: 3, duration: 26, delay: 0, color: 'bg-accent-blue' },
  { left: '18%', size: 2, duration: 34, delay: 6, color: 'bg-accent-blue' },
  { left: '31%', size: 4, duration: 30, delay: 12, color: 'bg-accent-pink' },
  { left: '44%', size: 2, duration: 38, delay: 3, color: 'bg-accent-blue' },
  { left: '57%', size: 3, duration: 28, delay: 16, color: 'bg-accent-green' },
  { left: '69%', size: 2, duration: 36, delay: 9, color: 'bg-accent-blue' },
  { left: '81%', size: 4, duration: 32, delay: 20, color: 'bg-accent-pink' },
  { left: '93%', size: 2, duration: 40, delay: 14, color: 'bg-accent-blue' },
]

function BackgroundFX() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg-primary"
    >
      {/* drifting grid, oversized by one tile so the loop is seamless */}
      <div
        className="animate-grid-drift absolute -inset-8"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56,189,248,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* slow ambient glows */}
      <div
        className="animate-glow-drift absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.16), transparent 65%)',
        }}
      />
      <div
        className="animate-glow-drift absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          animationDelay: '-9s',
          background:
            'radial-gradient(circle, rgba(244,114,182,0.13), transparent 65%)',
        }}
      />

      {/* rising pixel motes */}
      {MOTES.map((m) => (
        <span
          key={m.left}
          className={`animate-float-up pixelated absolute bottom-[-6vh] ${m.color}`}
          style={{
            left: m.left,
            width: `${m.size}px`,
            height: `${m.size}px`,
            animationDuration: `${m.duration}s`,
            animationDelay: `-${m.delay}s`,
          }}
        />
      ))}

      {/* faint CRT scan sweep */}
      <div
        className="animate-scan-sweep absolute inset-x-0 h-24"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(56,189,248,0.05), transparent)',
        }}
      />
    </div>
  )
}

export default BackgroundFX
