import { TelegramService } from './telegram.service';
import { TelegramUser } from './interfaces/telegram-user.interface';
export declare class TelegramController {
    private readonly telegramService;
    constructor(telegramService: TelegramService);
    search(searchText: string): Promise<{
        telegram_users: TelegramUser[];
        users: any[];
        error?: undefined;
    } | {
        telegram_users: any[];
        users: any[];
        error: any;
    }>;
    generate(body: {
        phone: string;
        max: number;
    }): Promise<{
        message: string;
        count: number;
    }>;
    connectToUser(body: {
        telegramUserId: number;
        userId: number;
    }): Promise<{
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
        success: boolean;
    } | {
        success: boolean;
        message: any;
    }>;
}
