/*
  Warnings:

  - You are about to drop the column `barberId` on the `service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_barberId_fkey";

-- AlterTable
ALTER TABLE "service" DROP COLUMN "barberId";

-- CreateTable
CREATE TABLE "_BarberServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BarberServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BarberServices_B_index" ON "_BarberServices"("B");

-- AddForeignKey
ALTER TABLE "_BarberServices" ADD CONSTRAINT "_BarberServices_A_fkey" FOREIGN KEY ("A") REFERENCES "barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberServices" ADD CONSTRAINT "_BarberServices_B_fkey" FOREIGN KEY ("B") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
