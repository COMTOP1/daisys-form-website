import BookingsTable from "@/components/BookingsTable";
import Image from "next/image";
import React from "react";
import prisma from "@/lib/prisma";

export default async function Bookings() {
  const bookings = await prisma.bookings.findMany({
    include: {
      bookingDate: true
    },
    where: {
      bookingDate: {
        date: {
          gt : new Date()
        }
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 mainColour sm:items-start">
        <Image src={"/daisys-logo.png"} alt={"default logo"} className={"max-w-xs mx-auto p-3"} width={300}
               height={200}/>
        <h1 className="text-2xl font-semibold mb-4">Bookings Management</h1>
        <div className="overflow-x-auto w-full">
          <BookingsTable bookings={bookings} />
        </div>
      </main>
    </div>
  );
}
