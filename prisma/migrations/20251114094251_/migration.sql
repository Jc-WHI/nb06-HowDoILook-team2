/*
  Warnings:

  - You are about to drop the column `styleId` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tags]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Made the column `curatingId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `styleId` on table `Curating` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_styleId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "curatingId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Curating" ALTER COLUMN "styleId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "styleId";

-- CreateTable
CREATE TABLE "_StyleTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StyleTags_AB_unique" ON "_StyleTags"("A", "B");

-- CreateIndex
CREATE INDEX "_StyleTags_B_index" ON "_StyleTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tags_key" ON "Tag"("tags");

-- AddForeignKey
ALTER TABLE "_StyleTags" ADD CONSTRAINT "_StyleTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StyleTags" ADD CONSTRAINT "_StyleTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
