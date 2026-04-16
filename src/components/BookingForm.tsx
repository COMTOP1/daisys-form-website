"use client";

import React, {useState} from "react";
import {z} from "zod";
import {addBooking, print} from "@/app/(cheese-and-wine)/book/handle";
import {niceDateFormatter} from "@/lib/dateFormatter";

export default function BookingForm({availableDates}: {availableDates: {
    id: number
    date: Date
    maxSpaces: number
  }[]}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    people: 2,
    date: 0,
    comment: "",
  });

  const bookingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required")
      .transform(val => val.replace(/\s+/g, ""))
      .refine(val => /^(\+[1-9])?\d{1,14}$/.test(val), {
        message: "Phone number doesn't match formatting",
      }),
    people: z.preprocess((val) => parseInt(val as string),
      z.number().int().min(2, "At least 2 people").max(8, "At most 8 people")),
    date: z.preprocess((val) => parseInt(val as string),
      z.int().min(0, "Date is required")),
    comment: z.string().nullable(),
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const {name, value} = e.target;

    setForm((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setError("");

    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    const booking = result.data;

    console.log("Booking submitted");
    await print(booking);
    await addBooking(booking);
    window.location.href="/book/thank-you";
  };

  return (
    <>
      <p><i>Please note this booking does not guarantee a table, you will receive a separate email later with the
        confirmation</i></p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of People (2-8) *
          </label>
          <select
            name="people"
            value={form.people}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 text-white"
          >
            {Array.from({length: 7}, (_, i) => i + 2).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <select
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 text-white"
          >
            <option value={0}>Please select</option>
            {availableDates.map((d) => (
              <option key={d.id} value={d.id}>
                {niceDateFormatter.format(new Date(d.date))}
              </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Leave a comment or special request
          </label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-foreground text-background py-2 rounded hover:bg-gray-200"
        >
          Submit
        </button>
      </form>
    </>
  )
}
