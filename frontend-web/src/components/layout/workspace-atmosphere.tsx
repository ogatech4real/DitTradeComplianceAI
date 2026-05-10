/**
 * Layered ambience on top of the global mesh background — warm accent, restrained motion.
 */
export function WorkspaceAtmosphere() {
  return (
    <>
      <div
        className="animate-mesh-pulse workspace-mesh-warm pointer-events-none fixed inset-0 z-0 opacity-80"
        aria-hidden
      />
      <div
        className="workspace-grid-warm pointer-events-none fixed inset-0 z-[1] opacity-[0.09]"
        style={{
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
