/*
  Warnings:

  - Added the required column `image` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePublicId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "imagePublicId" TEXT NOT NULL;
