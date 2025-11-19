-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'RARE', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'OPEN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForestFriend" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ForestFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForestFriendBodyPart" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "forestFriendId" INTEGER NOT NULL,

    CONSTRAINT "ForestFriendBodyPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trail" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mapUrl" TEXT,
    "description" TEXT NOT NULL,

    CONSTRAINT "Trail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrailPhoto" (
    "id" SERIAL NOT NULL,
    "trailId" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,

    CONSTRAINT "TrailPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "trailId" INTEGER NOT NULL,
    "bodyPartId" INTEGER,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBodyPart" (
    "userId" INTEGER NOT NULL,
    "bodyPartId" INTEGER NOT NULL,
    "foundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBodyPart_pkey" PRIMARY KEY ("userId","bodyPartId")
);

-- CreateTable
CREATE TABLE "UserTrail" (
    "userId" INTEGER NOT NULL,
    "trailId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTrail_pkey" PRIMARY KEY ("userId","trailId")
);

-- CreateTable
CREATE TABLE "TrailBodyPart" (
    "trailId" INTEGER NOT NULL,
    "bodyPartId" INTEGER NOT NULL,

    CONSTRAINT "TrailBodyPart_pkey" PRIMARY KEY ("trailId","bodyPartId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "ForestFriendBodyPart" ADD CONSTRAINT "ForestFriendBodyPart_forestFriendId_fkey" FOREIGN KEY ("forestFriendId") REFERENCES "ForestFriend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailPhoto" ADD CONSTRAINT "TrailPhoto_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "ForestFriendBodyPart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBodyPart" ADD CONSTRAINT "UserBodyPart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBodyPart" ADD CONSTRAINT "UserBodyPart_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "ForestFriendBodyPart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrail" ADD CONSTRAINT "UserTrail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrail" ADD CONSTRAINT "UserTrail_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailBodyPart" ADD CONSTRAINT "TrailBodyPart_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "Trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrailBodyPart" ADD CONSTRAINT "TrailBodyPart_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "ForestFriendBodyPart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
