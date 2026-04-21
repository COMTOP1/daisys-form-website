import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const {date, maxSpaces} = await request.json();
    if (!date) {
      return NextResponse.json({error: "date required"}, {status: 400});
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({error: "invalid date"}, {status: 400});
    }
    const max = typeof maxSpaces === "number" && maxSpaces > 0 ? maxSpaces : 20;

    const newDate = await prisma.availableDates.create({
      data: {
        date: parsedDate,
        maxSpaces: max,
      },
    });

    return NextResponse.json(newDate, {status: 201});
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "an error has occurred"}, {status: 500});
  }
}
