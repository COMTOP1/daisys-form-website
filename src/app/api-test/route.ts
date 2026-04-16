import {renderEmailTemplate} from "@/lib/emailTemplate";
import {NextResponse} from "next/server";

export async function GET(_: Request) {
  const html = await renderEmailTemplate("booking-confirmation", {
    name: "Liam Burnand",
    bookingRef: "ABC123",
    dateAndTime: "Saturday 28th March 2026 @ 19:00",
  });
  return NextResponse.json({html: html.html});
}