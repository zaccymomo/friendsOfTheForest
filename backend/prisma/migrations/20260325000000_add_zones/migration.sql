-- CreateTable
CREATE TABLE "Zone" (
    "id" INTEGER NOT NULL,
    "narrative" TEXT NOT NULL,
    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "zoneId" INTEGER;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "UserZone" (
    "userId"    INTEGER NOT NULL,
    "zoneId"    INTEGER NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserZone_pkey" PRIMARY KEY ("userId","zoneId")
);

-- AddForeignKey
ALTER TABLE "UserZone" ADD CONSTRAINT "UserZone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserZone" ADD CONSTRAINT "UserZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
