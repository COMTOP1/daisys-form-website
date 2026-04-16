import {renderEmailTemplate} from "@/lib/emailTemplate";

export default async function TestPage() {
  const html = await renderEmailTemplate("booking-confirmation", {
    name: "Liam Burnand",
    bookingRef: "ABC123",
    dateAndTime: "Saturday 28th March 2026 @ 19:00",
  });
  return html.html;
}