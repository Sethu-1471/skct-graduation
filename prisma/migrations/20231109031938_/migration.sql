/*
  Warnings:

  - Added the required column `uniqueId` to the `Registrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registrations" ADD COLUMN     "acc_count" INTEGER,
ADD COLUMN     "batch" VARCHAR(255),
ADD COLUMN     "branch" VARCHAR(255),
ADD COLUMN     "current_status" VARCHAR(255),
ADD COLUMN     "details_curr_status" TEXT,
ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "phone_number" VARCHAR(255),
ADD COLUMN     "uniqueId" VARCHAR(255) NOT NULL,
ADD COLUMN     "will_participate" BOOLEAN DEFAULT false;
