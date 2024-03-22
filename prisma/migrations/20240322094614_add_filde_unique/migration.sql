/*
  Warnings:

  - A unique constraint covering the columns `[action]` on the table `permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dob` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `dob` DATETIME(3) NOT NULL,
    MODIFY `status` TINYINT NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `permission_action_key` ON `permission`(`action`);

-- CreateIndex
CREATE UNIQUE INDEX `role_name_key` ON `role`(`name`);
