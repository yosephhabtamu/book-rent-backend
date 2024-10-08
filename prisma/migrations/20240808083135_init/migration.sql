-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'owner', 'user');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "wallet" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookType" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "status" "BookStatus" NOT NULL DEFAULT 'pending',
    "categoryId" UUID NOT NULL,

    CONSTRAINT "BookType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookUser" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "bookTypeId" UUID NOT NULL,

    CONSTRAINT "BookUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookRent" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "lentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3),
    "bookUserId" UUID,
    "bookTypeId" UUID NOT NULL,

    CONSTRAINT "BookRent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "BookType" ADD CONSTRAINT "BookType_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookUser" ADD CONSTRAINT "BookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookUser" ADD CONSTRAINT "BookUser_bookTypeId_fkey" FOREIGN KEY ("bookTypeId") REFERENCES "BookType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRent" ADD CONSTRAINT "BookRent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRent" ADD CONSTRAINT "BookRent_bookTypeId_fkey" FOREIGN KEY ("bookTypeId") REFERENCES "BookType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRent" ADD CONSTRAINT "BookRent_bookUserId_fkey" FOREIGN KEY ("bookUserId") REFERENCES "BookUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
