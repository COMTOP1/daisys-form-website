import Image from "next/image";
import React from "react";
import AvailableDatesTable from "@/components/AvailableDatesTable";
import AvailableDatesForm from "@/components/AvailableDatesForm";
import {getDates} from "@/lib/dates";

export default async function BookingsByDates({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; includePast?: string; user?: string }>;
}) {
  const awaitedSearchParams = await searchParams;
  const pageRaw = awaitedSearchParams.page ?? "1";
  const includePast = awaitedSearchParams.includePast === "true";
  const page = isNaN(Number(pageRaw)) ? 1 : Number(pageRaw);

  const dates = await getDates({ includePast: includePast, page: page });

  return (
    <div className="flex min-h-screen items-center justify-center font-sans baseColour">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 mainColour sm:items-start">
        <Image src={"/daisys-logo.png"} alt={"default logo"} className={"max-w-xs mx-auto p-3"} width={300}
               height={200}/>
        <h1 className="text-2xl font-semibold mb-4">Available Dates</h1>
        <div className="overflow-x-auto w-full">
          <AvailableDatesTable dates={dates} />
        </div>
        <AvailableDatesForm />
      </main>
    </div>
  );
}
