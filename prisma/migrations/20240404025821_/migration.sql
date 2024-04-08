/*
  Warnings:

  - A unique constraint covering the columns `[user_id,job_id]` on the table `application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `application_user_id_job_id_key` ON `application`(`user_id`, `job_id`);
