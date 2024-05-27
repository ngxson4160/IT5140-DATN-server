/*
  Warnings:

  - Added the required column `type` to the `conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `type` INTEGER NOT NULL;
