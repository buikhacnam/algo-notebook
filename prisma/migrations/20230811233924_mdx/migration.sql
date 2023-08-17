/*
  Warnings:

  - You are about to drop the column `category` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `posts` table. All the data in the column will be lost.
  - Added the required column `mdId` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progress` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `star` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `category`,
    DROP COLUMN `level`,
    DROP COLUMN `note`,
    ADD COLUMN `mdId` VARCHAR(191) NOT NULL,
    ADD COLUMN `progress` VARCHAR(191) NOT NULL,
    ADD COLUMN `star` BOOLEAN NOT NULL;
