import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateActionDto } from './dto/create-action.dto';
export declare class ActionService {
    private prisma;
    private telegramService;
    constructor(prisma: PrismaService, telegramService: TelegramService);
    createAction(clientId: number, createDto: CreateActionDto, isSuperAdmin: boolean): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ActionStatus;
        maxCount: number;
        processedCount: number;
        completedAt: Date | null;
        clientId: number;
    }>;
    getActions(clientId: number, isSuperAdmin: boolean): Promise<({
        client: {
            id: number;
            phone: string;
            fullname: string;
        };
        items: ({
            telegramUser: {
                id: number;
                telegramId: bigint;
                userId: number | null;
                phone: string;
                firstName: string;
                lastName: string;
                fullname: string;
                username: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            phone: string;
            createdAt: Date;
            actionId: number;
            telegramUserId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ActionStatus;
        maxCount: number;
        processedCount: number;
        completedAt: Date | null;
        clientId: number;
    })[]>;
    getAction(actionId: number, clientId: number, isSuperAdmin: boolean): Promise<{
        client: {
            id: number;
            phone: string;
            fullname: string;
        };
        items: ({
            telegramUser: {
                id: number;
                telegramId: bigint;
                userId: number | null;
                phone: string;
                firstName: string;
                lastName: string;
                fullname: string;
                username: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            phone: string;
            createdAt: Date;
            actionId: number;
            telegramUserId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ActionStatus;
        maxCount: number;
        processedCount: number;
        completedAt: Date | null;
        clientId: number;
    }>;
    private processAction;
}
