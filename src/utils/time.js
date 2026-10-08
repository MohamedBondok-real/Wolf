/** Time helpers for the "Time Since We Met" counter. */

/** Calendar-accurate breakdown of the time since a start date. */
export function timeSince(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  if (Number.isNaN(start.getTime()) || now < start) {
    return { years: 0, months: 0, days: 0, hours: 0, totalDays: 0 };
  }

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

  return { years, months, days, hours, totalDays };
}

/** Format an ISO-ish date as a readable string, e.g. "14 Jun 2021". */
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
