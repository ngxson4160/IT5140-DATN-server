/*
  Warnings:

  - You are about to drop the column `notification_template_id` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notification_template` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `notification_template` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `notification_template` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_notification_template_id_fkey`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `notification_template_id`,
    DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `notification_template` DROP COLUMN `title`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL,
    MODIFY `content` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `notification_template_code_key` ON `notification_template`(`code`);
