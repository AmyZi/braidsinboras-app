// src/lib/calendar.ts

import { google } from "googleapis";
import dayjs from "dayjs";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

/**
 * Get busy times from Google Calendar
 */
export async function getBusySlots(date: string) {

  const start = dayjs(date).startOf("day").toISOString();
  const end   = dayjs(date).endOf("day").toISOString();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      items: [{ id: process.env.GOOGLE_CALENDAR_ID! }]
    }
  });

  return res.data.calendars?.[process.env.GOOGLE_CALENDAR_ID!]?.busy || [];
}

/**
 * Create calendar event when booking is confirmed
 */
export async function createCalendarEvent(
  name: string,
  email: string,
  date: string,
  time: string
) {

  const start = dayjs(`${date} ${time}`);
  const end   = start.add(1, "hour"); // fixed slot length

  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    requestBody: {
      summary: `Hair Booking — ${name}`,
      description: `Customer: ${email}`,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() }
    }
  });
}
