-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_curatingId_fkey";

-- DropForeignKey
ALTER TABLE "Curating" DROP CONSTRAINT "Curating_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_styleId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curating" ADD CONSTRAINT "Curating_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_curatingId_fkey" FOREIGN KEY ("curatingId") REFERENCES "Curating"("id") ON DELETE CASCADE ON UPDATE CASCADE;
