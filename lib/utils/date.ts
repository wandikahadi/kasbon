const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function formatRelativeDate(
  value: string | Date
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  const now = new Date();

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffDays = Math.round(
    (targetDate.getTime() - today.getTime()) /
      DAY_IN_MS
  );

  if (diffDays === 0) {
    return "hari ini";
  }

  if (diffDays === -1) {
    return "kemarin";
  }

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} hari lalu`;
  }

  if (diffDays === 1) {
    return "besok";
  }

  return `${diffDays} hari lagi`;
}