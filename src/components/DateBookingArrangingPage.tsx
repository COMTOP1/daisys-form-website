"use client";

import { DragEvent, useState } from "react";
import { AssignmentStatus, BookingStatus } from "../../generated/prisma/enums";
import { bookingsDateFormatter } from "@/lib/dateFormatter";

export default function DateBookingArrangingPage({
  date,
}: {
  date: {
    bookings: ({
      assignment: {
        id: number;
        status: AssignmentStatus;
        bookingId: number;
        tableId: number;
        seats: number;
      }[];
    } & {
      id: number;
      createdAt: Date;
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
    })[];
    id: number;
    date: Date;
    maxSpaces: number;
    bookedUp: boolean;
  };
}) {
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(
    date?.bookings.filter((b) => b.status === "CONFIRMED") || [],
  );
  const [unselected, setUnselected] = useState(
    date?.bookings.filter((b) => b.status !== "CONFIRMED") || [],
  );

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
    const response = await fetch("/api/send-booking-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingIds: selected.map((b) => b.id),
        dateId: date.id,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Email process result:", data);
      setSubmitted(true);
    } else {
      console.error("Failed to process bookings");
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
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div
          style={{ flex: 1, border: "1px dashed #ccc", padding: "1rem" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "unselected")}
          className="booking-list"
        >
          <h2 className={"text-xl font-semibold mb-4"}>Unselected Bookings</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {unselected.map((b) => (
              <li
                key={b.id}
                className={"m-2 p-2"}
                draggable
                onDragStart={(e) => handleDragStart(e, b.id)}
                style={{ cursor: "grab", background: "#4a4a4a" }}
              >
                {b.name} (<b>{b.people}</b> seats) – Booked at:{" "}
                {bookingsDateFormatter.format(new Date(b.createdAt))}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            width: "1px",
            background: "#e0e0e0",
            height: "calc(100% - 2rem)",
          }}
        ></div>

        <div
          style={{ flex: 1, border: "1px dashed #ccc", padding: "1rem" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "selected")}
          className="booking-list"
        >
          <h2 className={"text-xl font-semibold mb-4"}>Selected Bookings</h2>
          <p>
            <i>
              Selected seats: {selectedSeats} / {maxSpaces}
            </i>
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selected.map((b) => (
              <li
                key={b.id}
                className={"m-2 p-2"}
                draggable
                onDragStart={(e) => handleDragStart(e, b.id)}
                style={{ cursor: "grab", background: "#4a4a4a" }}
              >
                {b.name} (<b>{b.people}</b> seats) –{" "}
                {bookingsDateFormatter.format(new Date(b.createdAt))}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={handleSubmit} disabled={submitted}>
        Submit Selected
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#2a2a2a",
              padding: "2rem",
              borderRadius: "0.5rem",
              maxWidth: "28rem",
              width: "100%",
            }}
          >
            <h2 className="text-xl font-semibold mb-2">Confirm submission</h2>
            <p className="mb-1">
              You are about to confirm <b>{selected.length}</b> booking
              {selected.length !== 1 ? "s" : ""} ({selectedSeats} seats) and
              reject <b>{unselected.length}</b> booking
              {unselected.length !== 1 ? "s" : ""}.
            </p>
            <p className="mb-4">
              <i>Emails will be sent to all affected customers.</i>
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
