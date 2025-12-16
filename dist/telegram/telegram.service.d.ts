import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramUser } from './interfaces/telegram-user.interface';
export declare class TelegramService implements OnModuleInit {
    private prisma;
    private readonly logger;
    private client;
    private sessionPath;
    private userAccessHashCache;
    private isConnected;
    private isConnecting;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private connectToTelegram;
    private ensureConnected;
    private formatPhone;
    searchUser(query: string): Promise<{
        telegramUsers: TelegramUser[];
        users: any[];
    }>;
    private searchInDatabase;
    private findByPhone;
    private findByUsername;
    private findById;
    private saveOrUpdateUser;
    generateUsers(startPhone: string, count: number): Promise<void>;
    private processGeneration;
    private connectToUser;
    private searchUsers;
    connectTelegramUserToUser(telegramUserId: number, userId: number): Promise<{
        message: string;
        telegramUser: {
            id: number;
            telegramId: number;
            phone: string;
        };
        user: {
            id: number;
            name: string;
            surname: string;
        };
    }>;
}
