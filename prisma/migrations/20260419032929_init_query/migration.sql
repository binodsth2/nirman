-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;

-- CreateTable
CREATE TABLE "queries" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "inputflag" INTEGER NOT NULL DEFAULT 0,
    "output" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queries_pkey" PRIMARY KEY ("id")
);
