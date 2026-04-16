import React from "react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";

export default async function BookForm() {
  const availableDates = await prisma.availableDates.findMany({
    where: {
      date: {
        gt: new Date(),
      },
      bookedUp: false,
    }
  });

  if (!availableDates || availableDates.length < 1) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans baseColour">
        <main
          className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-12 px-8 sm:items-start mainColour">
          <Image src={"/cheese-and-wine-logo.png"} alt={"default logo"} className={"max-w-xs mx-auto p-3"} width={300}
                 height={200}/>
          <h1 className="text-3xl font-semibold mb-6">Book a Cheese &amp; Wine night table</h1>
          <p className="underline">Unfortunately there are no available Cheese &amp; Wine nights to book</p>
          <p>Please check back later for another available Cheese &amp; Wine night</p>
          <div></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main
        className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-12 px-8 sm:items-start mainColour">
        <Image src={"/cheese-and-wine-logo.png"} alt={"default logo"} className={"max-w-xs mx-auto p-3"} width={300}
               height={200}/>
        <h1 className="text-3xl font-semibold mb-6">Book a Cheese &amp; Wine night table</h1>
        <BookingForm availableDates={availableDates}></BookingForm>
      </main>
    </div>
  );
}
