"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BookingStatus } from "../../generated/prisma/enums";
import { niceDateFormatter } from "@/lib/dateFormatter";
import Pagination from "@/components/Pagination";

export default function AvailableDatesTable({
  dates,
}: {
  dates: {
    availableDates: ({
      bookings: {
        id: number;
        name: string;
        email: string;
        phone: string;
        people: number;
        bookingDateId: number;
        comment: string | null;
        status: BookingStatus;
        emailSentAt: Date | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }[];
    } & {
      id: number;
      date: Date;
      maxSpaces: number;
    })[];
    pagination: {
      page: number;
      totalPages: number;
    };
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showPast = searchParams.get("includePast") === "true";

  const togglePast = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("includePast", "true");
    } else {
      params.delete("includePast");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-300">
          {dates.availableDates.length} date
          {dates.availableDates.length !== 1 ? "s" : ""}
        </p>
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            Show past dates
          </span>
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${showPast ? "bg-green-600" : "bg-gray-500"}`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showPast ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </div>
          <input
            type="checkbox"
            checked={showPast}
            onChange={(e) => togglePast(e.target.checked)}
            className="sr-only"
          />
        </label>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-500/40">
        <table className="min-w-full divide-y divide-gray-500/40">
          <thead className="bg-black/20">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Capacity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500/40">
            {dates.availableDates.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No dates found
                </td>
              </tr>
            ) : (
              dates.availableDates.map((d) => {
                const isFull = d.bookings.length >= d.maxSpaces;
                return (
                  <tr
                    key={d.id}
                    onClick={() =>
                      (window.location.href = "/admin/bookings/by-date/" + d.id)
                    }
                    className="cursor-pointer transition-colors hover:bg-white/10"
                  >
                    <td className="px-4 py-3 text-sm text-gray-300">{d.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {niceDateFormatter.format(new Date(d.date))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      <span
                        className={
                          isFull ? "text-red-400" : "text-gray-300"
                        }
                      >
                        {d.bookings.length}
                      </span>
                      <span className="text-gray-500"> / {d.maxSpaces}</span>
                    </td>
                    <td className="px-4 py-3">
                      {isFull ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-800 text-white">
                          Full
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-700 text-white">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={dates.pagination.page}
        totalPages={dates.pagination.totalPages}
      />
    </div>
  );
}
