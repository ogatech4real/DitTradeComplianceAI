/**
 * Cinematic workstation ambience — animated halo, cyber grid drift, restrained scan veil.
 */
export function WorkspaceAtmosphere() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 bg-background" aria-hidden />
      <div
        className="animate-workspace-halo pointer-events-none fixed inset-0 z-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% -8%, color-mix(in oklch, var(--primary) 32%, transparent), transparent 52%),
            radial-gradient(ellipse 55% 45% at 92% 12%, color-mix(in oklch, var(--brand-secondary) 22%, transparent), transparent 50%),
            radial-gradient(ellipse 50% 40% at 6% 88%, color-mix(in oklch, var(--brand-tertiary) 18%, transparent), transparent 48%)`,
        }}
        aria-hidden
      />
      <div className="workspace-holo-grid pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <div className="workspace-noise-mask pointer-events-none fixed inset-0 z-[2] opacity-[0.026] mix-blend-overlay" aria-hidden />
      <div className="workspace-scan-lines pointer-events-none fixed inset-0 z-[3] animate-workspace-scan opacity-[0.042] mix-blend-screen" aria-hidden />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[4] h-52 bg-[linear-gradient(to_top,var(--background),transparent_78%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[4] h-44 bg-[linear-gradient(to_bottom,var(--background),transparent)]"
        aria-hidden
      />
    </>
  );
}
