/**
 * Layered ambience on top of the global mesh background — restrained motion.
 */
export function WorkspaceAtmosphere() {
  return (
    <>
      <div
        className="animate-mesh-pulse pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% -5%, color-mix(in oklch, var(--primary) 20%, transparent), transparent 62%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(118deg, color-mix(in oklch, var(--brand-secondary) 70%, transparent) 0.5px, transparent 0.5px),
            linear-gradient(-14deg, color-mix(in oklch, var(--brand-tertiary) 55%, transparent) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "128px 128px, 168px 168px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[1] h-40 bg-[linear-gradient(to_top,var(--background),transparent)]"
        aria-hidden
      />
    </>
  );
}
