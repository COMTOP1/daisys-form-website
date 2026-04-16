"use client";

import {BookingStatus} from "../../generated/prisma/enums";

export default function BookingsByDateTable({dates}: {dates: {
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
      formattedDate?: string
      maxSpaces: number
      bookedUp: boolean
    })[];
    pagination: {
      page: number;
      totalPages: number;
    };
  }}) {

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Bookings</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Confirmed?</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {dates.availableDates.map((d) => (
        <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => window.location.href = "/admin/bookings/by-date/" + d.id}>
          <td className="px-4 py-2">{d.id}</td>
          <td className="px-4 py-2">{d.formattedDate}</td>
          <td className="px-4 py-2">{d.bookings.length}</td>
          <td className="px-4 py-2">{d.bookedUp ? "Confirmed" : "Not confirmed"}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
