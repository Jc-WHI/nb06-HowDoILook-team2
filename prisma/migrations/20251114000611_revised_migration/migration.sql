/*
  Warnings:

  - You are about to drop the `_StyleTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StyleTags" DROP CONSTRAINT "_StyleTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_StyleTags" DROP CONSTRAINT "_StyleTags_B_fkey";

-- DropIndex
DROP INDEX "Tag_tags_key";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "styleId" INTEGER;

-- DropTable
DROP TABLE "_StyleTags";

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;
