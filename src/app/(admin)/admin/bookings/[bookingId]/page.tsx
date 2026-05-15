import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { niceDateFormatter, bookingsDateFormatter } from "@/lib/dateFormatter";

export default async function BookingDetail({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const id = Number(bookingId);

  if (!Number.isInteger(id) || id < 1) {
    return <p>Invalid booking id</p>;
  }

  const booking = await prisma.bookings.findUnique({
    where: { id },
    include: { bookingDate: true },
  });

  if (!booking) notFound();

  const deleteBooking = async () => {
    "use server";
    await prisma.bookings.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    redirect("/admin/bookings");
  };

  const statusColour =
    booking.status === "CONFIRMED"
      ? "bg-green-600"
      : booking.status === "PENDING"
        ? "bg-yellow-600"
        : booking.status === "REJECTED"
          ? "bg-red-600"
          : "bg-blue-600";

  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-start py-16 px-8 mainColour">
        <Image
          src={"/daisys-logo.png"}
          alt={"default logo"}
          className={"max-w-xs mx-auto p-3"}
          width={300}
          height={200}
        />
        <a href={"/admin/bookings"}>&#8592; Return to bookings</a>
        <h1 className="text-2xl font-semibold mt-4 mb-6">
          Booking #{booking.id}
        </h1>

        {booking.deletedAt && (
          <p className="mb-4 text-red-500 font-semibold">
            This booking has been deleted.
          </p>
        )}

        <dl className="w-full space-y-3">
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Name</dt>
            <dd>{booking.name}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Email</dt>
            <dd>{booking.email}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Phone</dt>
            <dd>{booking.phone}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">People</dt>
            <dd>{booking.people}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Date</dt>
            <dd>{niceDateFormatter.format(booking.bookingDate.date)}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Comment</dt>
            <dd>{booking.comment ?? <span className="text-gray-500">—</span>}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Status</dt>
            <dd>
              <span
                className={`rounded-full px-2 py-0.5 text-white text-sm ${statusColour}`}
              >
                {booking.status}
              </span>
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Booked at</dt>
            <dd>{bookingsDateFormatter.format(booking.createdAt)}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 font-medium text-gray-400">Email sent</dt>
            <dd>
              {booking.emailSentAt
                ? bookingsDateFormatter.format(booking.emailSentAt)
                : <span className="text-gray-500">Not sent</span>}
            </dd>
          </div>
        </dl>

        {!booking.deletedAt && (
          <form action={deleteBooking} className="mt-8">
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
            >
              Delete Booking
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
