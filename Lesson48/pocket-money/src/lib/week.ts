/** Monday 00:00:00.000 – Sunday 23:59:59.999 in the local timezone. */
export function getLocalWeekBounds(now = new Date()): {
  weekStart: Date;
  weekEnd: Date;
} {
  const local = new Date(now);
  const day = local.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  const weekStart = new Date(local);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - daysFromMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}
