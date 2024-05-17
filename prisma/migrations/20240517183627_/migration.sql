/*
  Warnings:

  - You are about to drop the column `district` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `district`,
    ADD COLUMN `district_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `district`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
