"use client";

import { useState } from "react";
import { BookingStatus } from "../../generated/prisma/enums";

export default function BookingsByDateTable({
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
      formattedDate?: string;
      maxSpaces: number;
      bookedUp: boolean;
    })[];
    pagination: {
      page: number;
      totalPages: number;
    };
  };
}) {
  const [showPast, setShowPast] = useState(false);
  const now = new Date();
  const visibleDates = showPast
    ? dates.availableDates
    : dates.availableDates.filter((d) => new Date(d.date) >= now);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-300">
          {visibleDates.length} date{visibleDates.length !== 1 ? "s" : ""}
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
            onChange={(e) => setShowPast(e.target.checked)}
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
                Bookings
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500/40">
            {visibleDates.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No upcoming dates
                </td>
              </tr>
            ) : (
              visibleDates.map((d) => {
                const isPast = new Date(d.date) < now;
                return (
                  <tr
                    key={d.id}
                    onClick={() =>
                      (window.location.href = "/admin/bookings/by-date/" + d.id)
                    }
                    className={`cursor-pointer transition-colors ${
                      isPast
                        ? "opacity-50 hover:opacity-75 hover:bg-white/5"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {d.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {d.formattedDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {d.bookings.length}
                    </td>
                    <td className="px-4 py-3">
                      {d.bookedUp ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-700 text-white">
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-500/50 text-gray-300">
                          Pending
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
    </div>
  );
}
