/*
  Warnings:

  - You are about to drop the column `bookTypeId` on the `BookRent` table. All the data in the column will be lost.
  - You are about to drop the column `bookTypeId` on the `BookUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookRent" DROP CONSTRAINT "BookRent_bookTypeId_fkey";

-- DropForeignKey
ALTER TABLE "BookUser" DROP CONSTRAINT "BookUser_bookTypeId_fkey";

-- AlterTable
ALTER TABLE "BookRent" DROP COLUMN "bookTypeId";

-- AlterTable
ALTER TABLE "BookUser" DROP COLUMN "bookTypeId";

-- AddForeignKey
ALTER TABLE "BookUser" ADD CONSTRAINT "BookUser_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRent" ADD CONSTRAINT "BookRent_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
