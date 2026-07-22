'use client'

/**
 * A deliberately static global backdrop.  The previous version kept a full-screen
 * canvas, particle simulation, and scroll/mouse springs active on every route.
 * That competed with the actual UI (and the landing page's own stars) on slower
 * machines.  These layered gradients retain the same visual atmosphere without
 * a continuous JavaScript animation or per-frame canvas work.
 */
export function GalaxyBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#04020A]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: [
            'radial-gradient(circle at 16% 12%, rgba(168, 85, 247, 0.16), transparent 30%)',
            'radial-gradient(circle at 84% 72%, rgba(255, 75, 145, 0.12), transparent 32%)',
            'radial-gradient(circle at 52% 42%, rgba(99, 102, 241, 0.08), transparent 36%)',
          ].join(','),
        }}
      />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: [
            'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.7) 0 1px, transparent 1.5px)',
            'radial-gradient(circle at 70% 55%, rgba(192,132,252,0.7) 0 1px, transparent 1.5px)',
            'radial-gradient(circle at 35% 80%, rgba(255,77,184,0.5) 0 1px, transparent 1.5px)',
          ].join(','),
          backgroundSize: '137px 149px, 193px 211px, 251px 227px',
          backgroundPosition: '0 0, 41px 73px, 109px 19px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,2,10,0.62)_100%)]" />
    </div>
  )
}
