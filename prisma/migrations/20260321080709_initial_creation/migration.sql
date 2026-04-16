-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'TENTATIVE', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('TENTATIVE', 'CONFIRMED');

-- CreateTable
CREATE TABLE "auditLogs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availableDates" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "maxSpaces" INTEGER NOT NULL DEFAULT 20,
    "bookedUp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "availableDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "people" INTEGER NOT NULL,
    "bookingDateId" INTEGER NOT NULL,
    "comment" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "emailSentAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bookings_bookingDateId_fkey" FOREIGN KEY ("bookingDateId") REFERENCES "availableDates"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "minSeats" INTEGER NOT NULL,
    "maxSeats" INTEGER NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookingTableAssignments" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "tableId" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'TENTATIVE',

    CONSTRAINT "bookingTableAssignments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bookingTableAssignments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookingTableAssignments_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "bookingTableAssignments_bookingId_tableId_key" ON "bookingTableAssignments"("bookingId", "tableId");
