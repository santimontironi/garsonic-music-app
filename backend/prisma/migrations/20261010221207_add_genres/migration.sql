/*
  Warnings:

  - Added the required column `genreId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenreName" AS ENUM ('ROCK', 'POP', 'HIP_HOP', 'TRAP', 'REGGAETON', 'CUMBIA', 'CUARTETO', 'TANGO', 'FOLK', 'ELECTRONIC', 'JAZZ', 'BLUES', 'RNB', 'SOUL', 'FUNK', 'METAL', 'PUNK', 'INDIE', 'CLASSICAL', 'REGGAE', 'OTHER');

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "genreId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Genre" (
    "id" UUID NOT NULL,
    "name" "GenreName" NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
