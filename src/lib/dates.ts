import {AssignmentStatus, BookingStatus, Prisma} from "../../generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getDates({
                                    includePast = false,
                                    page = 1,
                                    pageSize = 20,
                                  }: {
  includePast?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{
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
}> {
  const where: Prisma.availableDatesWhereInput = {};

  if (!includePast) {
    where.date = {
      gt: new Date(),
    }
  }

  const [dates, totalCount] = await Promise.all([
    await prisma.availableDates.findMany({
      include: {
        bookings: true,
      },
      where,
      skip: (page - 1) * 20,
      take: 20,
    }),
    prisma.availableDates.count({
      where,
    }),
  ]);

  return {
    availableDates: dates,
    pagination: {
      page,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function getDateAndBookings({id}: {id: number}) {
  const date = await prisma.availableDates.findUnique({
    where: {
      id,
    },
    include: {
      bookings: {
        include: {assignment: true},
        orderBy: {
          createdAt: "asc",
        }
      }
    },
  });

  return date;
}