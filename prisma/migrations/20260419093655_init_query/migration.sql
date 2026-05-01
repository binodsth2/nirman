/*
  Warnings:

  - You are about to drop the `queries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "queries";

-- CreateTable
CREATE TABLE "Query" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "inputflag" BOOLEAN NOT NULL DEFAULT false,
    "output" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);
