-- AlterTable
ALTER TABLE `posts` MODIFY `progress` VARCHAR(191) NULL,
    MODIFY `star` BOOLEAN NULL DEFAULT false;
