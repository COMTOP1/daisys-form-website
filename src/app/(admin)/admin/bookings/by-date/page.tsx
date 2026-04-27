import Image from "next/image";
import BookingsByDateTable from "@/components/BookingsByDateTable";
import React from "react";
import {getDates} from "@/lib/dates";
import {niceDateFormatter} from "@/lib/dateFormatter";

export const dynamic = "force-dynamic";

export default async function BookingsByDate() {
  const dates = await getDates({includePast: true});

  for (let i = 0; i < dates.availableDates.length; i++) {
    dates.availableDates[i].formattedDate = niceDateFormatter.format(new Date(dates.availableDates[i].date))
  }

  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 mainColour sm:items-start">
        <Image src={"/daisys-logo.png"} alt={"default logo"} className={"max-w-xs mx-auto p-3"} width={300}
               height={200}/>
        <h1 className="text-2xl font-semibold mb-4">Bookings Management by dates</h1>
        <p>Please select a date from the table below to manage bookings</p>
        <div className="overflow-x-auto w-full">
          <BookingsByDateTable dates={dates} />
        </div>
      </main>
    </div>
  )
}