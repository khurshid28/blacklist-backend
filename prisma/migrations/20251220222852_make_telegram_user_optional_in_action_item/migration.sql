-- DropForeignKey
ALTER TABLE `actionitem` DROP FOREIGN KEY `ActionItem_telegramUserId_fkey`;

-- AlterTable
ALTER TABLE `actionitem` MODIFY `telegramUserId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ActionItem` ADD CONSTRAINT `ActionItem_telegramUserId_fkey` FOREIGN KEY (`telegramUserId`) REFERENCES `TelegramUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
