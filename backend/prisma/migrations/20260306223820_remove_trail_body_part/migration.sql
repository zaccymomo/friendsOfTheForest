/*
  Warnings:

  - You are about to drop the `TrailBodyPart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrailBodyPart" DROP CONSTRAINT "TrailBodyPart_bodyPartId_fkey";

-- DropForeignKey
ALTER TABLE "TrailBodyPart" DROP CONSTRAINT "TrailBodyPart_trailId_fkey";

-- DropTable
DROP TABLE "TrailBodyPart";
