-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Top', 'Bottom', 'Outer', 'Onepiece', 'Shoes', 'Bag', 'Accessory');

-- CreateTable
CREATE TABLE "Style" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL,
    "curatingCount" INTEGER NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "Category" NOT NULL,
    "styleId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "styleId" INTEGER,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "styleId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curating" (
    "id" SERIAL NOT NULL,
    "trendy" INTEGER NOT NULL,
    "individuality" INTEGER NOT NULL,
    "practicality" INTEGER NOT NULL,
    "valueForMoney" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "styleId" INTEGER,

    CONSTRAINT "Curating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "curatingId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comment_curatingId_key" ON "Comment"("curatingId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curating" ADD CONSTRAINT "Curating_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_curatingId_fkey" FOREIGN KEY ("curatingId") REFERENCES "Curating"("id") ON DELETE SET NULL ON UPDATE CASCADE;
