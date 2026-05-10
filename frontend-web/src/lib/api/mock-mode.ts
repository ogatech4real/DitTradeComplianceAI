/**
 * Deterministic mock API — use when FastAPI is unreachable or for UI work.
 * Toggle: `NEXT_PUBLIC_USE_MOCK_API=true` in `.env.local` (and Vercel Preview if needed).
 */

export function shouldUseMockApi(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
}

export async function mockNetworkDelay(ms = 450): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}
