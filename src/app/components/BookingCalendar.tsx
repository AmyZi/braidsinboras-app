"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function BookingCalendar({ onSelect }: any) {
  const [date, setDate] = useState<Date>();

  return (
    <div>
      <DayPicker
        mode="single"
        selected={date}
        onSelect={(d) => {
          setDate(d);
          onSelect(d);
        }}
      />
    </div>
  );
}