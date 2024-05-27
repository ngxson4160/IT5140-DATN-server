/*
  Warnings:

  - You are about to drop the column `from_user_id` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `to_user_id` on the `conversation` table. All the data in the column will be lost.
  - Added the required column `conversation_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `conversation_from_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `conversation_to_user_id_fkey`;

-- DropIndex
DROP INDEX `conversation_from_user_id_to_user_id_key` ON `conversation`;

-- AlterTable
ALTER TABLE `conversation` DROP COLUMN `from_user_id`,
    DROP COLUMN `to_user_id`,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `conversation_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `user_has_conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `conversation_id` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `create_by` INTEGER NULL,
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_by` INTEGER NULL,

    UNIQUE INDEX `user_has_conversation_user_id_conversation_id_key`(`user_id`, `conversation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_has_conversation` ADD CONSTRAINT `user_has_conversation_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_has_conversation` ADD CONSTRAINT `user_has_conversation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
