"use server";

import prisma from "@/lib/prisma";
import { renderEmailTemplate } from "@/lib/emailTemplate";
import { niceDateFormatter } from "@/lib/dateFormatter";
import { sendEmail } from "@/lib/mailer";

export async function addBooking(booking: {
  name: string;
  email: string;
  phone: string;
  people: number;
  date: number;
  comment: string | null;
}): Promise<boolean> {
  const result = await prisma.bookings.create({
    data: {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      people: booking.people,
      bookingDateId: booking.date,
      comment: booking.comment,
    },
  });

  if (!result) {
    console.error("Failed to add booking");
    return false;
  }

  // Check if this booking pushed the date to capacity and notify admins
  try {
    await notifyAdminsIfAtCapacity(booking.date, result.people);
  } catch (err) {
    console.error("Failed to send admin capacity notification:", err);
  }

  return true;
}

async function notifyAdminsIfAtCapacity(
  dateId: number,
  newBookingPeople: number,
) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (adminEmails.length === 0) return;

  const dateInfo = await prisma.availableDates.findUnique({
    where: { id: dateId },
    include: { bookings: { where: { deletedAt: null } } },
  });

  if (!dateInfo) return;

  const totalSeats = dateInfo.bookings.reduce((sum, b) => sum + b.people, 0);
  const previousTotal = totalSeats - newBookingPeople;

  // Only send once — when this booking is the one that first hits capacity
  if (previousTotal >= dateInfo.maxSpaces || totalSeats < dateInfo.maxSpaces) {
    return;
  }

  const dateAndTime = niceDateFormatter.format(dateInfo.date);
  const adminUrl = process.env.SITE_URL ?? "";

  const html = await renderEmailTemplate("admin-date-full", {
    dateAndTime,
    maxSpaces: dateInfo.maxSpaces,
    totalSeats,
    totalBookings: dateInfo.bookings.length,
    dateId,
    adminUrl,
  });

  await sendEmail({
    to: adminEmails,
    subject: `Daisy's: Bookings for ${dateAndTime} have reached capacity`,
    html,
  });
}
