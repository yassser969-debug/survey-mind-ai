export type DurationUnits = {
  min: string;
  hour: string;
  days: string;
  dash: string;
};

/** Human-readable duration between activation and close (or now). */
export function collectionDuration(
  activatedAt: string | null,
  closedAt: string | null,
  units: DurationUnits = { min: "min", hour: "h", days: "days", dash: "—" }
): string {
  if (!activatedAt) return units.dash;

  const start = new Date(`${activatedAt}Z`).getTime();
  const end = closedAt ? new Date(`${closedAt}Z`).getTime() : Date.now();
  const minutes = Math.max(0, Math.round((end - start) / 60000));

  if (minutes < 60) return `${minutes} ${units.min}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} ${units.hour} ${minutes % 60} ${units.min}`;
  return `${Math.floor(hours / 24)} ${units.days}`;
}
