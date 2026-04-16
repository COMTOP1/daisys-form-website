"use client";

import {BookingStatus} from "../../generated/prisma/enums";

export default function BookingsTable({bookings}: {bookings: {
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
    bookingDate: {
      id: number
      date: Date
      maxSpaces: number
    }
  }[]}) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">ID</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Name</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Phone</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">People</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Comment</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {bookings.map((b) => (
        <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => window.location.href = "/admin/bookings/" + b.id}>
          <td className="px-4 py-2">{b.id}</td>
          <td className="px-4 py-2">{b.name}</td>
          <td className="px-4 py-2">{b.email}</td>
          <td className="px-4 py-2">{b.phone}</td>
          <td className="px-4 py-2">{b.people}</td>
          <td className="px-4 py-2">{new Date(b.bookingDate.date).toString()}</td>
          <td className="px-4 py-2">{b.comment}</td>
          <td className="px-4 py-2">
            <span className={`rounded-full px-2 py-0.5 mb-1 mr-1 shadow-sm ${b.status === "PENDING" ? "bg-yellow-600" : b.status === "CONFIRMED" ? "text-green-600" : "text-blue-600"} text-white ml-2`}>
              {b.status}
            </span>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
