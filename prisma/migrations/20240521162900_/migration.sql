/*
  Warnings:

  - Added the required column `content` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification` ADD COLUMN `content` TEXT NOT NULL;
