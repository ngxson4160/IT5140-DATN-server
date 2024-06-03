/*
  Warnings:

  - Added the required column `image` to the `blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blog` ADD COLUMN `image` VARCHAR(191) NOT NULL;
