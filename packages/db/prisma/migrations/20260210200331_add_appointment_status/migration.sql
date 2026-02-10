/*
  Warnings:

  - A unique constraint covering the columns `[date,time,barberId]` on the table `appointment` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `time` on the `appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADO', 'CONFIRMADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "AppointmentTime" AS ENUM ('T0800', 'T0830', 'T0900', 'T0930', 'T1000', 'T1030', 'T1100', 'T1130', 'T1400', 'T1430', 'T1500', 'T1530', 'T1600', 'T1630', 'T1700', 'T1730', 'T1800', 'T1830', 'T1900', 'T1930', 'T2000');

-- AlterTable
ALTER TABLE "appointment" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'AGENDADO',
DROP COLUMN "time",
ADD COLUMN     "time" "AppointmentTime" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appointment_date_time_barberId_key" ON "appointment"("date", "time", "barberId");
