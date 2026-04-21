"use client";

import React, { useState } from "react";
// import toast from "react-hot-toast" if needed

export default function AvailableDatesForm() {
  const [date, setDate] = useState<string>('');
  const [maxSpaces, setMaxSpaces] = useState<number>(20);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!date) return;
    setLoading(true);
    try {
      const res = await fetch('/api/availableDates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, maxSpaces }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to create date');
      }
      // reload to show new date
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col space-y-4 max-w-md">
      <label className="flex flex-col">
        Date and time
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 p-2 border rounded"
        />
      </label>
      <label className="flex flex-col">
        Max Spaces
        <input
          type="number"
          value={maxSpaces}
          onChange={(e) => setMaxSpaces(parseInt(e.target.value))}
          min="1"
          required
          className="mt-1 p-2 border rounded"
        />
      </label>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Adding...' : 'Add Date'}
      </button>
    </form>
  );
}
