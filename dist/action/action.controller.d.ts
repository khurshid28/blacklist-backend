import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
export declare class ActionController {
    private readonly actionService;
    constructor(actionService: ActionService);
    createAction(req: any, createDto: CreateActionDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ActionStatus;
        maxCount: number;
        processedCount: number;
        completedAt: Date | null;
        clientId: number;
    }>;
    getActions(req: any): Promise<({
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
    getAction(req: any, id: string): Promise<{
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
}
