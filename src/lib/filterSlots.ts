export function availableSlots(slots:any[], bookings:any[], date:string){

  return slots
    .filter(s => s.slot_date === date)
    .filter(slot =>
      !bookings.some(b =>
        b.booking_date === slot.slot_date &&
        b.booking_time === slot.slot_time
      )
    );
}
