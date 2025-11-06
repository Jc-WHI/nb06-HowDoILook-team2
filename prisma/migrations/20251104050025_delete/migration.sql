/*
  Warnings:

  - You are about to drop the `Curation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Style` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StyleItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Curation" DROP CONSTRAINT "Curation_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_styleId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_curationId_fkey";

-- DropForeignKey
ALTER TABLE "StyleItem" DROP CONSTRAINT "StyleItem_styleId_fkey";

-- DropTable
DROP TABLE "Curation";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Reply";

-- DropTable
DROP TABLE "Style";

-- DropTable
DROP TABLE "StyleItem";

-- DropEnum
DROP TYPE "StyleCategory";
