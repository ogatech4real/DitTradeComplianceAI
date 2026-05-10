/**
 * Subtle atmospheric depth — stays below content, purely decorative.
 */
export function WorkspaceAtmosphere() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.55]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_70%_-10%,oklch(0.62_0.09_265_/_0.14),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_15%_25%,oklch(0.58_0.07_205_/_0.1),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_92%_88%,oklch(0.55_0.06_195_/_0.08),transparent_45%)]" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(105deg, oklch(0.35 0.02 258 / 55%) 0.5px, transparent 0.5px),
            linear-gradient(-18deg, oklch(0.4 0.02 240 / 40%) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "140px 140px, 180px 180px",
        }}
        aria-hidden
      />
    </>
  );
}
