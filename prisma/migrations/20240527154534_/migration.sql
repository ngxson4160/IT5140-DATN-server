-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `status` TINYINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `message` MODIFY `content` TEXT NOT NULL;
