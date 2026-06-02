import Image from "next/image";
import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="flex min-h-screen w-full max-w-5xl flex-col items-center py-16 px-8 mainColour sm:items-start">
      <Image
        src={"/daisys-logo.png"}
        alt={"default logo"}
        className={"max-w-xs mx-auto p-3"}
        width={300}
        height={200}
        priority
      />
      <h1 className="text-2xl font-semibold text-white mt-4 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-300 mb-8">
        Manage bookings and available dates from the links below.
      </p>
      <nav className="flex flex-col gap-3 w-full max-w-sm">
        <Link
          href="/admin/bookings/by-date"
          className="rounded-lg border border-gray-500/40 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Bookings by Date &rarr;
        </Link>
        <Link
          href="/admin/availableDates"
          className="rounded-lg border border-gray-500/40 bg-black/20 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Available Dates &rarr;
        </Link>
      </nav>
    </div>
  );
}
