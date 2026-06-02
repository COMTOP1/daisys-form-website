"use client";

import { DragEvent, useState } from "react";
import { AssignmentStatus, BookingStatus } from "../../generated/prisma/enums";

type Booking = {
  assignment: {
    id: number;
    status: AssignmentStatus;
    bookingId: number;
    tableId: number;
    seats: number;
  }[];
  id: number;
  createdAt: Date;
  createdAtFormatted: string;
  name: string;
  status: BookingStatus;
  email: string;
  phone: string;
  people: number;
  bookingDateId: number;
  comment: string | null;
  emailSentAt: Date | null;
  deletedAt: Date | null;
  updatedAt: Date;
};

function BookingCard({
  booking,
  draggable,
  onDragStart,
}: {
  booking: Booking;
  draggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLLIElement>) => void;
}) {
  return (
    <li
      draggable={draggable}
      onDragStart={onDragStart}
      className={`rounded border border-gray-500/40 bg-black/20 px-3 py-2 text-sm text-white ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <span className="font-medium">{booking.name}</span>
      <span className="text-gray-400"> &mdash; </span>
      <span className="font-semibold">{booking.people}</span>
      <span className="text-gray-400">
        {" "}
        seat{booking.people !== 1 ? "s" : ""}
      </span>
      <span className="text-gray-500 text-xs ml-2">
        Booked {booking.createdAtFormatted}
      </span>
      {booking.comment && (
        <p className="mt-1 text-xs text-gray-400 italic">{booking.comment}</p>
      )}
    </li>
  );
}

function ConfirmedView({
  date,
}: {
  date: { bookings: Booking[]; maxSpaces: number };
}) {
  const confirmed = date.bookings.filter((b) => b.status === "CONFIRMED");
  const rejected = date.bookings.filter((b) => b.status !== "CONFIRMED");
  const confirmedSeats = confirmed.reduce((sum, b) => sum + b.people, 0);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="rounded-lg border border-green-700/50 bg-black/20 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-green-700/20 border-b border-green-700/50">
          <h2 className="text-base font-semibold text-white">
            Confirmed Bookings
          </h2>
          <span className="text-sm text-gray-300">
            {confirmedSeats} / {date.maxSpaces} seats
          </span>
        </div>
        <ul className="flex flex-col gap-2 p-4">
          {confirmed.length === 0 ? (
            <p className="text-sm text-gray-400">No confirmed bookings.</p>
          ) : (
            confirmed.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </ul>
      </div>

      {rejected.length > 0 && (
        <div className="rounded-lg border border-gray-500/40 bg-black/20 overflow-hidden">
          <div className="px-4 py-3 bg-black/20 border-b border-gray-500/40">
            <h2 className="text-base font-semibold text-gray-400">
              Rejected Bookings
            </h2>
          </div>
          <ul className="flex flex-col gap-2 p-4">
            {rejected.map((b) => (
              <li
                key={b.id}
                className="rounded border border-gray-500/40 bg-black/20 px-3 py-2 text-sm opacity-50"
              >
                <span className="font-medium text-white">{b.name}</span>
                <span className="text-gray-400"> &mdash; </span>
                <span className="font-semibold text-white">{b.people}</span>
                <span className="text-gray-400">
                  {" "}
                  seat{b.people !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  Booked {b.createdAtFormatted}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function DateBookingArrangingPage({
  date,
}: {
  date: {
    bookings: Booking[];
    id: number;
    date: Date;
    maxSpaces: number;
    bookedUp: boolean;
  };
}) {
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selected, setSelected] = useState(
    date?.bookings.filter((b) => b.status === "CONFIRMED") || [],
  );
  const [unselected, setUnselected] = useState(
    date?.bookings.filter((b) => b.status !== "CONFIRMED") || [],
  );

  if (date.bookedUp) {
    return <ConfirmedView date={date} />;
  }

  const selectedSeats = selected.reduce((sum, b) => sum + b.people, 0);
  const maxSpaces = date?.maxSpaces ?? 0;

  const handleDrop = (event: DragEvent<HTMLDivElement>, target: string) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const booking = selected
      .concat(unselected)
      .find((b) => b.id === Number(id));
    if (!booking) return;
    const isInSelected = selected.some((b) => b.id === booking.id);
    const isInUnselected = unselected.some((b) => b.id === booking.id);
    if (target === "selected" && isInSelected) return;
    if (target === "unselected" && isInUnselected) return;
    if (target === "selected") {
      setUnselected((prev) => prev.filter((b) => b.id !== booking.id));
      setSelected((prev) => [...prev, booking]);
    } else {
      setSelected((prev) => prev.filter((b) => b.id !== booking.id));
      setUnselected((prev) => [...prev, booking]);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLLIElement>, id: number) => {
    event.dataTransfer.setData("text/plain", id.toString());
  };

  const handleConfirm = async () => {
    setShowModal(false);
    setSubmitError(null);
    try {
      const response = await fetch("/api/send-booking-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingIds: selected.map((b) => b.id),
          dateId: date.id,
        }),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json().catch(() => ({}));
        if (data.msg !== undefined) {
          setSubmitError(`Message: ${data.msg}, error: ${data.err}`);
        } else {
          setSubmitError("Submission failed. Please try again.");
        }
      }
    } catch {
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    }
  };

  const handleSubmit = () => {
    if (selectedSeats > maxSpaces) {
      alert("Selected seats are more than the maximum available seats.");
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="flex gap-8 items-stretch w-full mt-4">
        <div
          className="flex-1 rounded-lg border border-dashed border-gray-500/60 p-4 min-h-48"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "unselected")}
        >
          <h2 className="text-base font-semibold text-white mb-3">
            Unselected Bookings
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({unselected.length})
            </span>
          </h2>
          <ul className="flex flex-col gap-2">
            {unselected.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                draggable
                onDragStart={(e) => handleDragStart(e, b.id)}
              />
            ))}
          </ul>
        </div>

        <div className="w-px bg-gray-500/40 self-stretch" />

        <div
          className="flex-1 rounded-lg border border-dashed border-gray-500/60 p-4 min-h-48"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "selected")}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white">
              Selected Bookings
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({selected.length})
              </span>
            </h2>
            <span
              className={`text-sm ${selectedSeats > maxSpaces ? "text-red-400" : "text-gray-400"}`}
            >
              {selectedSeats} / {maxSpaces} seats
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {selected.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                draggable
                onDragStart={(e) => handleDragStart(e, b.id)}
              />
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted}
        className="mt-6 rounded bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-50"
      >
        {submitted ? "Submitted" : "Submit Selected"}
      </button>
      {submitError && (
        <p className="mt-2 text-sm text-red-400">{submitError}</p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg border border-gray-500/40 bg-[#2a2a2a] p-8">
            <h2 className="text-xl font-semibold text-white mb-2">
              Confirm submission
            </h2>
            <p className="mb-1 text-sm text-gray-300">
              You are about to confirm{" "}
              <span className="font-semibold text-white">
                {selected.length}
              </span>{" "}
              booking{selected.length !== 1 ? "s" : ""} ({selectedSeats} seats)
              and reject{" "}
              <span className="font-semibold text-white">
                {unselected.length}
              </span>{" "}
              booking{unselected.length !== 1 ? "s" : ""}.
            </p>
            <p className="mb-6 text-sm text-gray-400 italic">
              Emails will be sent to all affected customers.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded border border-gray-500/50 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
