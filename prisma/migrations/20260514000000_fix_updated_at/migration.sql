-- AlterTable: remove DB-level default so Prisma @updatedAt manages the value
ALTER TABLE "bookings" ALTER COLUMN "updatedAt" DROP DEFAULT;
