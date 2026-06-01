import prisma from "@/lib/prisma";
import { renderEmailTemplate } from "@/lib/emailTemplate";
import { niceDateFormatter } from "@/lib/dateFormatter";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingIds, dateId } = body;

    const allDateBookings = await prisma.bookings.findMany({
      where: { bookingDateId: dateId, deletedAt: null },
      include: { bookingDate: true },
    });

    const selectedSet = new Set(bookingIds as number[]);
    const selectedBookings = allDateBookings.filter((b) =>
      selectedSet.has(b.id),
    );
    const unselectedBookings = allDateBookings.filter(
      (b) => !selectedSet.has(b.id),
    );

    // Server-side seat validation using DB data
    const maxSpaces = allDateBookings[0]?.bookingDate.maxSpaces ?? 0;
    const selectedSeats = selectedBookings.reduce(
      (sum, b) => sum + b.people,
      0,
    );
    if (selectedSeats > maxSpaces) {
      return new Response(
        JSON.stringify({ error: "Selected seats exceed maximum spaces" }),
        { status: 400 },
      );
    }

    // Capture which bookings haven't been emailed yet before updating emailSentAt
    const needsEmailIds = new Set(
      allDateBookings.filter((b) => !b.emailSentAt).map((b) => b.id),
    );

    // Update selected bookings to CONFIRMED
    if (selectedBookings.length > 0) {
      await prisma.bookings.updateMany({
        where: {
          id: { in: selectedBookings.map((b) => b.id) },
          deletedAt: null,
        },
        data: { status: "CONFIRMED", emailSentAt: new Date() },
      });
    }

    // Update unselected bookings to REJECTED and delete their assignments
    if (unselectedBookings.length > 0) {
      const unselectedIds = unselectedBookings.map((b) => b.id);
      await prisma.bookings.updateMany({
        where: { id: { in: unselectedIds }, deletedAt: null },
        data: { status: "REJECTED", emailSentAt: new Date() },
      });
      await prisma.bookingTableAssignments.deleteMany({
        where: { bookingId: { in: unselectedIds } },
      });
    }

    // Mark the date as booked up so it no longer appears on the public booking form
    await prisma.availableDates.update({
      where: { id: dateId },
      data: { bookedUp: true },
    });

    // Send emails only to bookings that hadn't been emailed before this submission
    for (const booking of allDateBookings.filter((b) =>
      needsEmailIds.has(b.id),
    )) {
      const isSelected = selectedSet.has(booking.id);
      const dateAndTime = niceDateFormatter.format(booking.bookingDate.date);
      const templateName = isSelected
        ? "booking-confirmation"
        : "booking-rejection";

      const html = await renderEmailTemplate(templateName, {
        name: booking.name,
        dateAndTime,
        bookingRef: booking.id.toString(),
      });

      await sendEmail({
        to: booking.email,
        subject: isSelected
          ? `Your Cheese & Wine booking is confirmed – ${dateAndTime}`
          : `Your Cheese & Wine booking was unsuccessful – ${dateAndTime}`,
        html,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error processing bookings:", err);
    return new Response(
      JSON.stringify({ msg: "Failed to process bookings", error: err }),
      {
        status: 500,
      },
    );
  }
}
