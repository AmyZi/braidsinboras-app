// src/lib/slots.ts

import dayjs from "dayjs";
import { businessHours } from "./businessHours";

type Busy = {
  start: string;
  end: string;
};

export function generateDailySlots(date: string) {
  const slots: string[] = [];

  for (let hour = businessHours.start; hour < businessHours.end; hour++) {
    slots.push(dayjs(date).hour(hour).minute(0).format("HH:mm"));
  }

  return slots;
}

export function filterAvailableSlots(
  date: string,
  slots: string[],
  busy: Busy[]
) {

  return slots.filter(slot => {

    const slotTime = dayjs(`${date} ${slot}`);

    return !busy.some(b => {
      const start = dayjs(b.start);
      const end = dayjs(b.end);
      return slotTime.isAfter(start) && slotTime.isBefore(end);
    });

  });
}
