/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TelegramUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `telegramuser` ADD COLUMN `userId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TelegramUser_userId_key` ON `TelegramUser`(`userId`);

-- AddForeignKey
ALTER TABLE `TelegramUser` ADD CONSTRAINT `TelegramUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
