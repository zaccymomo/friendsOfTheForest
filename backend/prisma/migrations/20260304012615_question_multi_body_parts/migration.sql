-- CreateTable
CREATE TABLE "QuestionBodyPart" (
    "questionId" INTEGER NOT NULL,
    "bodyPartId" INTEGER NOT NULL,

    CONSTRAINT "QuestionBodyPart_pkey" PRIMARY KEY ("questionId","bodyPartId")
);

-- AddForeignKey
ALTER TABLE "QuestionBodyPart" ADD CONSTRAINT "QuestionBodyPart_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionBodyPart" ADD CONSTRAINT "QuestionBodyPart_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "ForestFriendBodyPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- MigrateData: Copy existing bodyPartId associations to join table
INSERT INTO "QuestionBodyPart" ("questionId", "bodyPartId")
SELECT "id", "bodyPartId" FROM "Question" WHERE "bodyPartId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_bodyPartId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "bodyPartId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;
