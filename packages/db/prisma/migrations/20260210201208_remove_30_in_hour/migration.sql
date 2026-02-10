/*
  Warnings:

  - The values [T0830,T0930,T1030,T1130,T1430,T1530,T1630,T1730,T1830,T1930] on the enum `AppointmentTime` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentTime_new" AS ENUM ('T0800', 'T0900', 'T1000', 'T1100', 'T1400', 'T1500', 'T1600', 'T1700', 'T1800', 'T1900', 'T2000');
ALTER TABLE "appointment" ALTER COLUMN "time" TYPE "AppointmentTime_new" USING ("time"::text::"AppointmentTime_new");
ALTER TYPE "AppointmentTime" RENAME TO "AppointmentTime_old";
ALTER TYPE "AppointmentTime_new" RENAME TO "AppointmentTime";
DROP TYPE "public"."AppointmentTime_old";
COMMIT;
