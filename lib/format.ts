/** Human-readable duration between activation and close (or now). */
export function collectionDuration(
  activatedAt: string | null,
  closedAt: string | null
): string {
  if (!activatedAt) return "—";

  const start = new Date(`${activatedAt}Z`).getTime();
  const end = closedAt ? new Date(`${closedAt}Z`).getTime() : Date.now();
  const minutes = Math.max(0, Math.round((end - start) / 60000));

  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} h ${minutes % 60} min`;
  return `${Math.floor(hours / 24)} days`;
}
