import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

interface TelegramUser {
  id: number;
  telegramId: number;
  phone: string;
  fullname: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('search')
  async search(@Query('search_text') searchText: string) {
    if (!searchText || searchText.trim().length === 0) {
      return { telegram_users: [], users: [] };
    }

    try {
      const { telegramUsers, users } = await this.telegramService.searchUser(searchText);
      return { telegram_users: telegramUsers, users };
    } catch (error: any) {
      return { telegram_users: [], users: [], error: error.message };
    }
  }

  @Post('generate')
  async generate(@Body() body: { phone: string; max: number }): Promise<{ message: string; count: number }> {
    const { phone, max = 10 } = body;
    
    if (!phone || phone.trim().length === 0) {
      return { message: 'Phone number is required', count: 0 };
    }

    const maxLimit = Math.min(max, 10);
    
    // Background'da ishlaydi
    this.telegramService.generateUsers(phone, maxLimit).catch(err => {
      console.error('Generate error:', err);
    });

    return { 
      message: `${maxLimit} ta raqam uchun Telegram qidiruv boshlandi. Har 3 sekundda 1 ta zapros yuboriladi.`,
      count: maxLimit 
    };
  }

  @Post('connect')
  async connectToUser(@Body() body: { telegramUserId: number; userId: number }) {
    const { telegramUserId, userId } = body;
    
    if (!telegramUserId || !userId) {
      return { success: false, message: 'telegramUserId and userId are required' };
    }

    try {
      const result = await this.telegramService.connectTelegramUserToUser(telegramUserId, userId);
      return { success: true, ...result };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
