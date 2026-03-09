import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

export const calendar = google.calendar({ version: "v3", auth });

// Block 4 hours per booking — stylist assesses actual duration on arrival
const DEFAULT_BLOCK_HOURS = 4;

function generateFreeSlots(
  start: Date,
  end: Date,
  busy: { start: string; end: string }[]
) {
  const slots = [];
  let current = new Date(start);
  const blockMs = DEFAULT_BLOCK_HOURS * 60 * 60 * 1000;

  while (current < end) {
    const slotEnd = new Date(current.getTime() + blockMs);
    const isBusy = busy.some(
      (b) => new Date(b.start) < slotEnd && new Date(b.end) > current
    );
    if (!isBusy && slotEnd <= end) {
      slots.push({
        start: current.toISOString(),
        label: current.toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Stockholm",
        }),
      });
    }
    current = new Date(current.getTime() + 30 * 60000); // 30 min intervals
  }
  return slots;
}

export async function getAvailableSlots(date: string) {
  const dayStart = new Date(`${date}T09:00:00+01:00`);
  const dayEnd = new Date(`${date}T18:00:00+01:00`);

  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: "Europe/Stockholm",
      items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
    },
  });

  const busy =
    data.calendars?.[process.env.GOOGLE_CALENDAR_ID!]?.busy ?? [];

  return generateFreeSlots(
    dayStart,
    dayEnd,
    busy as { start: string; end: string }[]
  );
}

export async function createCalendarBooking(booking: {
  customerName: string;
  customerEmail: string;
  service: string;
  startTime: string;
  notes?: string;
}) {
  console.log("CALENDAR ID:", process.env.GOOGLE_CALENDAR_ID);
  console.log("SERVICE ACCOUNT:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

  // Block 4 hours on calendar — actual end time confirmed by stylist
  const start = new Date(booking.startTime);
  const end = new Date(start.getTime() + DEFAULT_BLOCK_HOURS * 60 * 60 * 1000);

  const { data } = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    sendUpdates: "none",
    requestBody: {
      summary: `${booking.service} – ${booking.customerName}`,
      description: `Kund: ${booking.customerName}\nEmail: ${booking.customerEmail}${booking.notes ? `\nNoteringar: ${booking.notes}` : ""}\n\n⚠️ Sluttid beräknas vid ankomst beroende på hårlängd och densitet.`,
      start: {
        dateTime: start.toISOString(),
        timeZone: "Europe/Stockholm",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Europe/Stockholm",
      },
      status: "confirmed",
    },
  });

  return data;
}