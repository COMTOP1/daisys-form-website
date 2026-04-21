import prisma from "@/lib/prisma";
import DateBookingArrangingPage from "@/components/DateBookingArrangingPage";
import Image from "next/image";
import React from "react";
import {bookingsDateFormatter, dateFormatter} from "@/lib/dateFormatter";

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
    return (
      <p>Invalid date id</p>
    )
  }

  const date = await prisma.availableDates.findUnique({
    where: {
      id,
    },
    include: {
      bookings: {
        include: {assignment: true},
        orderBy: {
          createdAt: "asc",
        }
      }
    },
  });

  if (!date) {
    return (
      <p>Date not found</p>
    )
  }

  // for (let i = 0; i < date.bookings.length; i++) {
  //   date.bookings[i].createdAtFormatted = bookingsDateFormatter.format(new Date(date.bookings[i].createdAt))
  // }

  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main className="flex min-h-screen w-full flex-col items-center py-16 px-8 mainColour sm:items-start">
        <Image src={"/daisys-logo.png"} alt={"default logo"} className={"max-w-xs mx-auto p-3"} width={300}
               height={200}/>
        <a href={"/admin/bookings/by-date"}>&#8592; Return to table</a>
        <h1 className="text-2xl font-semibold mb-4">Bookings Management for {dateFormatter.format(date.date)}</h1>
        <p>Below you will have both the unselected bookings and selected bookings.</p>
        <p>The initial list of bookings is sorted from oldest to newest.</p>
        <p>Drag the bookings across until you are satisfied with the selection and hit submit.</p>
        <p><i>Please note that leaving the page unconfirmed doesn&#39;t save changes</i></p>
        <div className="overflow-x-auto w-full">
          <DateBookingArrangingPage date={date}></DateBookingArrangingPage>
        </div>
      </main>
    </div>
  )
}