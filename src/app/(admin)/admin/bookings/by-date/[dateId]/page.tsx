import prisma from "@/lib/prisma";
import DateBookingArrangingPage from "@/components/DateBookingArrangingPage";
import Image from "next/image";
import React from "react";
import { bookingsDateFormatter, dateFormatter } from "@/lib/dateFormatter";
import { revalidatePath } from "next/cache";

export default async function BookingByDate({
  params,
}: {
  params: Promise<{
    dateId: string;
  }>;
}) {
  const resolvedParams = await params;

  const id = Number(resolvedParams.dateId);

  if (!Number.isInteger(id) || id < 0) {
    return <p>Invalid date id</p>;
  }

  const date = await prisma.availableDates.findUnique({
    where: {
      id,
    },
    include: {
      bookings: {
        include: { assignment: true },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!date) {
    return <p>Date not found</p>;
  }

  const formattedDate = {
    ...date,
    bookings: date.bookings.map((b) => ({
      ...b,
      createdAtFormatted: bookingsDateFormatter.format(b.createdAt),
    })),
  };

  const reopenDate = async () => {
    "use server";
    await prisma.availableDates.update({
      where: { id },
      data: { bookedUp: false },
    });
    revalidatePath(`/admin/bookings/by-date/${id}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main className="flex min-h-screen w-full flex-col items-center py-16 px-8 mainColour sm:items-start">
        <Image
          src={"/daisys-logo.png"}
          alt={"default logo"}
          className={"max-w-xs mx-auto p-3"}
          width={300}
          height={200}
          priority
        />
        <a href={"/admin/bookings/by-date"}>&#8592; Return to table</a>
        <div className="flex items-center gap-4 mt-4 mb-2 w-full">
          <h1 className="text-2xl font-semibold">
            Bookings Management for {dateFormatter.format(date.date)}
          </h1>
          {date.bookedUp && (
            <span className="rounded-full px-2 py-0.5 bg-green-700 text-white text-sm">
              Confirmed
            </span>
          )}
        </div>
        {date.bookedUp && (
          <form action={reopenDate} className="mb-4">
            <button
              type="submit"
              className="bg-yellow-700 hover:bg-yellow-800 text-white px-3 py-1 rounded text-sm"
            >
              Re-open date
            </button>
          </form>
        )}
        <p>
          Below you will have both the unselected bookings and selected
          bookings.
        </p>
        <p>The initial list of bookings is sorted from oldest to newest.</p>
        <p>
          Drag the bookings across until you are satisfied with the selection
          and hit submit.
        </p>
        <p>
          <i>
            Please note that leaving the page unconfirmed doesn&#39;t save
            changes
          </i>
        </p>
        <div className="overflow-x-auto w-full">
          <DateBookingArrangingPage date={formattedDate}></DateBookingArrangingPage>
        </div>
      </main>
    </div>
  );
}
