"use client";

import React, { useState } from "react";

export default function AvailableDatesForm() {
  const [date, setDate] = useState<string>("");
  const [maxSpaces, setMaxSpaces] = useState<number>(20);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!date) return;
    setLoading(true);
    try {
      const res = await fetch("/api/availableDates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, maxSpaces }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to create date");
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-lg font-semibold text-white mb-4">Add New Date</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 rounded-lg border border-gray-500/40 bg-black/20 p-6"
      >
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Date and time
          </span>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded border border-gray-500/50 bg-black/30 px-3 py-2 text-sm text-white focus:border-gray-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Max spaces
          </span>
          <input
            type="number"
            value={maxSpaces}
            onChange={(e) => setMaxSpaces(parseInt(e.target.value))}
            min="1"
            required
            className="rounded border border-gray-500/50 bg-black/30 px-3 py-2 text-sm text-white focus:border-gray-400 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Date"}
        </button>
      </form>
    </div>
  );
}
