/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FavArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FavSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `albumId` column on the `Song` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SongPlaylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Album` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `artistId` on the `Album` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `FavArtist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `artistId` on the `FavArtist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `FavSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `songId` on the `FavSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Playlist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ownerId` on the `Playlist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `artistId` on the `Song` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `playlistId` on the `SongPlaylist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `songId` on the `SongPlaylist` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_artistId_fkey";

-- DropForeignKey
ALTER TABLE "FavArtist" DROP CONSTRAINT "FavArtist_artistId_fkey";

-- DropForeignKey
ALTER TABLE "FavArtist" DROP CONSTRAINT "FavArtist_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavSong" DROP CONSTRAINT "FavSong_songId_fkey";

-- DropForeignKey
ALTER TABLE "FavSong" DROP CONSTRAINT "FavSong_userId_fkey";

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_artistId_fkey";

-- DropForeignKey
ALTER TABLE "SongPlaylist" DROP CONSTRAINT "SongPlaylist_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "SongPlaylist" DROP CONSTRAINT "SongPlaylist_songId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "artistId",
ADD COLUMN     "artistId" UUID NOT NULL,
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FavArtist" DROP CONSTRAINT "FavArtist_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "artistId",
ADD COLUMN     "artistId" UUID NOT NULL,
ADD CONSTRAINT "FavArtist_pkey" PRIMARY KEY ("userId", "artistId");

-- AlterTable
ALTER TABLE "FavSong" DROP CONSTRAINT "FavSong_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "songId",
ADD COLUMN     "songId" UUID NOT NULL,
ADD CONSTRAINT "FavSong_pkey" PRIMARY KEY ("userId", "songId");

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" UUID NOT NULL,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Song" DROP CONSTRAINT "Song_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "artistId",
ADD COLUMN     "artistId" UUID NOT NULL,
DROP COLUMN "albumId",
ADD COLUMN     "albumId" UUID,
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SongPlaylist" DROP CONSTRAINT "SongPlaylist_pkey",
DROP COLUMN "playlistId",
ADD COLUMN     "playlistId" UUID NOT NULL,
DROP COLUMN "songId",
ADD COLUMN     "songId" UUID NOT NULL,
ADD CONSTRAINT "SongPlaylist_pkey" PRIMARY KEY ("playlistId", "songId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongPlaylist" ADD CONSTRAINT "SongPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongPlaylist" ADD CONSTRAINT "SongPlaylist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavArtist" ADD CONSTRAINT "FavArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavArtist" ADD CONSTRAINT "FavArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavSong" ADD CONSTRAINT "FavSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavSong" ADD CONSTRAINT "FavSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
