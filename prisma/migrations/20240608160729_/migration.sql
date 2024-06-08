-- CreateIndex
CREATE FULLTEXT INDEX `user_first_name_last_name_idx` ON `user`(`first_name`, `last_name`);
