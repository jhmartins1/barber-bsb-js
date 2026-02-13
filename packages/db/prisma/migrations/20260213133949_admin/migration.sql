-- AlterTable
ALTER TABLE "appointment" ADD COLUMN     "userName" TEXT,
ADD COLUMN     "userPhone" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
