"use server";

import prisma from "@/lib/prisma";

export async function print(msg: {
  name: string
  email: string
  phone: string
  people: number
  date: number
  comment: string | null
}): Promise<void> {
  console.log(msg);
}

export async function addBooking(booking: {
  name: string
  email: string
  phone: string
  people: number
  date: number
  comment: string | null
}): Promise<boolean> {
  const result = await prisma.bookings.create({
    data: {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      people: booking.people,
      bookingDateId: booking.date,
      comment: booking.comment
    }
  });

  if (!result) {
    console.log("failed to add booking");
    return false;
  }
  return true;
}