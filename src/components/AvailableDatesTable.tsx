"use client";

import {BookingStatus} from "../../generated/prisma/enums";
import Pagination from "@/components/Pagination";

export default function AvailableDatesTable({dates}: {
  dates: {
    availableDates: ({
      bookings: {
        id: number
        name: string
        email: string
        phone: string
        people: number
        bookingDateId: number
        comment: string | null
        status: BookingStatus
        emailSentAt: Date | null
        deletedAt: Date | null
        createdAt: Date
        updatedAt: Date
      }[]
    } & {
      id: number
      date: Date
      maxSpaces: number
    })[];
    pagination: {
      page: number,
      totalPages: number,
    };
  }
}) {
  return (
    <>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Max Spaces</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Current Bookings</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {dates.availableDates.map((d) => (
          <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => window.location.href = "/admin/bookings/by-date/" + d.id}>
            <td className="px-4 py-2">{d.id}</td>
            <td className="px-4 py-2">{new Date(d.date).toString()}</td>
            <td className="px-4 py-2">{d.maxSpaces}</td>
            <td className="px-4 py-2">{d.bookings.length}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <Pagination
        page={dates.pagination.page}
        totalPages={dates.pagination.totalPages}
      />
    </>
  )
}
