const pad = (n: number) => String(n).padStart(2, "0");
const dateStamp = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

/** Downloads a one-day calendar event (.ics) so people can schedule a check-in without us storing reminders. */
export function downloadCalendarReminder({
  date,
  title,
  description,
  url,
}: {
  date: Date;
  title: string;
  description: string;
  url: string;
}): void {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  const escape = (text: string) => text.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ikigai Finder//Check-in//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-checkin@ikigaifinder.ai`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${dateStamp(date)}`,
    `DTEND;VALUE=DATE:${dateStamp(next)}`,
    `SUMMARY:${escape(title)}`,
    `DESCRIPTION:${escape(`${description}\n${url}`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = href;
  link.download = "ikigai-check-in.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}
