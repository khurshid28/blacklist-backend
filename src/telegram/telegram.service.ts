import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';
import big from 'big-integer';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramUser } from './interfaces/telegram-user.interface';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private client: TelegramClient;
  private sessionPath = './telegram.session';
  private userAccessHashCache = new Map<string, string>(); // telegramId -> accessHash
  private isConnected = false;
  private isConnecting = false;

  constructor(private prisma: PrismaService) {
    const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
    const apiHash = process.env.TELEGRAM_API_HASH || '';
    
    let session;
    if (fs.existsSync(this.sessionPath)) {
      session = new StringSession(fs.readFileSync(this.sessionPath, 'utf8'));
    } else {
      session = new StringSession('');
    }
    
    // Proxy settings (for servers behind NAT/firewall)
    const useProxy = process.env.TELEGRAM_USE_PROXY === 'true';
    const proxyConfig = useProxy ? {
      socksType: 5 as const,
      ip: process.env.TELEGRAM_PROXY_HOST || '127.0.0.1',
      port: parseInt(process.env.TELEGRAM_PROXY_PORT || '1080'),
      ...(process.env.TELEGRAM_PROXY_USER && {
        username: process.env.TELEGRAM_PROXY_USER,
        password: process.env.TELEGRAM_PROXY_PASS || '',
      }),
    } : undefined;
    
    this.logger.log(useProxy ? `🔒 Using SOCKS5 proxy: ${proxyConfig?.ip}:${proxyConfig?.port}` : '🌐 Direct connection');
    
    // Extended connection settings for better reliability
    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 5,
      useWSS: false,
      timeout: 30000,
      requestRetries: 3,
      autoReconnect: false, // Manual reconnect control
      retryDelay: 3000,
      maxConcurrentDownloads: 1,
      ...(proxyConfig && { proxy: proxyConfig }),
    });
  }

  async onModuleInit() {
    // Don't block server startup - connect in background
    this.connectToTelegram().catch(err => {
      this.logger.error('❌ Initial Telegram connection failed:', err.message);
    });
  }

  private async connectToTelegram() {
    if (this.isConnecting) {
      this.logger.log('⏳ Connection already in progress...');
      return;
    }

    if (this.isConnected) {
      this.logger.log('✅ Already connected');
      return;
    }

    this.isConnecting = true;
    try {
      this.logger.log('🔌 Starting Telegram connection...');
      this.logger.log(`Session path: ${this.sessionPath}`);
      
      if (!fs.existsSync(this.sessionPath)) {
        this.logger.warn('⚠️  No session found. Telegram features will be disabled.');
        this.logger.warn('Please login first using telegram-login.js');
        return;
      }
      
      this.logger.log('📂 Session file found, connecting...');
      
      // Reduced timeout for faster failure detection
      this.logger.log('⏱️  Attempting connection with 30s timeout...');
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 30s')), 30000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      
      this.logger.log('✅ Telegram client connected successfully');
      
      this.logger.log('🔍 Checking authorization...');
      const isAuthorized = await this.client.checkAuthorization();
      
      if (!isAuthorized) {
        this.logger.error('❌ Not authorized! Session expired. Telegram features disabled.');
        this.logger.warn('Please re-login using telegram-login.js');
        this.isConnecting = false;
        return;
      }
      
      this.logger.log('✅ Authorization confirmed');
      this.logger.log('🎉 Telegram is ready and working!');
      this.isConnected = true;
      
      // Cache will be populated on-demand when searching users
      
    } catch (error: any) {
      this.logger.error('❌ Telegram connection failed:', error.message);
      this.logger.warn('⚠️  Telegram features will be disabled');
      this.isConnected = false;
      
      // Try to disconnect cleanly
      try {
        await this.client.disconnect();
      } catch (disconnectError) {
        // Ignore disconnect errors
      }
    } finally {
      this.isConnecting = false;
    }
  }

  private async ensureConnected(): Promise<boolean> {
    if (this.isConnected) {
      return true;
    }

    this.logger.warn('⚠️  Not connected to Telegram, attempting reconnect...');
    await this.connectToTelegram();
    return this.isConnected;
  }

  private formatPhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (!cleaned.startsWith('998')) {
      cleaned = '998' + cleaned;
    }
    return '+' + cleaned;
  }

  async searchUser(query: string): Promise<{ telegramUsers: TelegramUser[]; users: any[] }> {
    this.logger.log(`Search started for: ${query}`);
    console.log('=== TELEGRAM SEARCH ===');
    console.log('Query:', query);
    const telegramResults: TelegramUser[] = [];
    
    // Faqat raqamlarni ajratib olish
    const digitsOnly = query.replace(/\D/g, '');
    console.log('Digits only:', digitsOnly);
    
    // Telefon raqam (9 yoki 12 ta raqam bo'lsa) - birinchi telefon sifatida sinash
    if (digitsOnly.length === 9 || digitsOnly.length === 12) {
      console.log('Trying as PHONE number first...');
      try {
        const user = await this.findByPhone(query);
        if (user) {
          const savedUser = await this.saveOrUpdateUser(user);
          telegramResults.push(savedUser);
          console.log('Found via PHONE search');
        } else {
          console.log('Not found as phone, will try as Telegram ID if 9 digits');
        }
      } catch (error: any) {
        this.logger.error(`Phone search failed: ${error.message}`);
      }
    }
    
    // Username (agar @ bilan boshlansa yoki harf bor bo'lsa)
    if (/^@?\w+$/.test(query) && /[a-zA-Z]/.test(query)) {
      console.log('Detected as USERNAME');
      try {
        const user = await this.findByUsername(query);
        if (user) {
          const savedUser = await this.saveOrUpdateUser(user);
          telegramResults.push(savedUser);
        }
      } catch (error: any) {
        this.logger.error(`Username search failed: ${error.message}`);
      }
    }
    
    // Telegram ID (faqat raqamlar va telefon sifatida topilmagan bo'lsa)
    if (/^\d+$/.test(query) && telegramResults.length === 0) {
      console.log('Trying as TELEGRAM ID (phone search yielded nothing)');
      try {
        const user = await this.findById(digitsOnly);
        if (user) {
          const savedUser = await this.saveOrUpdateUser(user);
          telegramResults.push(savedUser);
          console.log('Found via TELEGRAM ID search');
        } else {
          console.log('Telegram ID search failed, will check database');
        }
      } catch (error: any) {
        this.logger.error(`ID search failed: ${error.message}, will check database`);
      }
    }
    
    // Agar Telegram'dan topilmasa, bazadan qidirish (Telegram ID bo'yicha ham)
    if (telegramResults.length === 0) {
      console.log('Not found in Telegram, searching local database (including by Telegram ID)...');
      const dbResults = await this.searchInDatabase(query);
      telegramResults.push(...dbResults);
    }
    
    // User qidirish
    const users = await this.searchUsers(query);
    
    console.log('=== SEARCH RESULTS ===');
    console.log('Found telegram_users:', telegramResults.length);
    console.log('Found users:', users.length);
    return { telegramUsers: telegramResults, users };
  }

  private async searchInDatabase(query: string): Promise<TelegramUser[]> {
    console.log('Database search for:', query);
    
    try {
      // Agar faqat raqamlar bo'lsa, telegramId va phone bo'yicha qidirish
      if (!isNaN(Number(query))) {
        const telegramIdStr = query;
        // Birinchi exact match bo'yicha tekshirish
        const exactMatch = await this.prisma.$queryRaw<any[]>`
          SELECT * FROM TelegramUser 
          WHERE CAST(telegramId AS CHAR) = ${telegramIdStr}
             OR phone = ${telegramIdStr}
             OR phone = ${`+998${telegramIdStr}`}
          LIMIT 20
        `;
        
        if (exactMatch && exactMatch.length > 0) {
          console.log('Database results (exact match):', exactMatch.length);
          return exactMatch.map(user => ({
            id: user.id,
            telegramId: Number(user.telegramId),
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            fullname: user.fullname,
            username: user.username,
            createdAt: new Date(user.createdAt).toISOString(),
            updatedAt: new Date(user.updatedAt).toISOString(),
          }));
        }
        
        // Agar exact topilmasa, LIKE bilan qidirish
        const likeResults = await this.prisma.$queryRaw<any[]>`
          SELECT * FROM TelegramUser 
          WHERE CAST(telegramId AS CHAR) LIKE ${`%${telegramIdStr}%`}
             OR phone LIKE ${`%${telegramIdStr}%`}
          LIMIT 20
        `;
        
        if (likeResults && likeResults.length > 0) {
          console.log('Database results (partial match):', likeResults.length);
          return likeResults.map(user => ({
            id: user.id,
            telegramId: Number(user.telegramId),
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            fullname: user.fullname,
            username: user.username,
            createdAt: new Date(user.createdAt).toISOString(),
            updatedAt: new Date(user.updatedAt).toISOString(),
          }));
        }
      }

      // Matn qidiruvi uchun (firstName, lastName, fullname, username) - jadval nomi TelegramUser
      const textResults = await this.prisma.$queryRaw<any[]>`
        SELECT * FROM TelegramUser 
        WHERE firstName LIKE ${`%${query}%`}
           OR lastName LIKE ${`%${query}%`}
           OR fullname LIKE ${`%${query}%`}
           OR username LIKE ${`%${query}%`}
        LIMIT 20
      `;

      console.log('Database results (text search):', textResults.length);
      
      return textResults.map(user => ({
        id: user.id,
        telegramId: Number(user.telegramId),
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        fullname: user.fullname,
        username: user.username,
        createdAt: new Date(user.createdAt).toISOString(),
        updatedAt: new Date(user.updatedAt).toISOString(),
      }));
    } catch (error: any) {
      console.log('Database search error:', error);
      this.logger.error(`Database search error: ${error.message}`);
      return [];
    }
  }

  private async findByPhone(phone: string): Promise<any> {
    try {
      if (!await this.ensureConnected()) {
        this.logger.warn('Cannot search by phone: not connected to Telegram');
        return null;
      }

      const formattedPhone = this.formatPhone(phone);
      console.log('findByPhone - Formatted:', formattedPhone);
      
      const result = await this.client.invoke(
        new Api.contacts.ImportContacts({
          contacts: [
            new Api.InputPhoneContact({
              clientId: big(Date.now()),
              phone: formattedPhone,
              firstName: 'Search',
              lastName: 'User',
            }),
          ],
        }),
      );

      console.log('findByPhone - API result:', result);
      if (result.users && result.users.length > 0) {
        const user = result.users[0] as any;
        console.log('findByPhone - User found:', user);
        
        // Cache the accessHash
        if (user.accessHash) {
          this.userAccessHashCache.set(user.id.toString(), user.accessHash.toString());
          console.log(`✅ Cached accessHash for user ${user.id}`);
        }
        
        return {
          telegram_id: user.id.toString(),
          username: user.username || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: formattedPhone,
        };
      }
      console.log('findByPhone - No users found');
      return null;
    } catch (error: any) {
      console.log('findByPhone - Error:', error);
      this.logger.error(`Phone search error: ${error.message}`);
      return null;
    }
  }

  private async findByUsername(username: string): Promise<any> {
    try {
      if (!await this.ensureConnected()) {
        this.logger.warn('Cannot search by username: not connected to Telegram');
        return null;
      }

      const cleanUsername = username.replace('@', '');
      
      const result = await this.client.invoke(
        new Api.contacts.ResolveUsername({
          username: cleanUsername,
        }),
      );

      const user = result.users[0] as any;
      if (user) {
        // Cache the accessHash
        if (user.accessHash) {
          this.userAccessHashCache.set(user.id.toString(), user.accessHash.toString());
          console.log(`✅ Cached accessHash for user ${user.id}`);
        }
        
        return {
          telegram_id: user.id.toString(),
          username: user.username || cleanUsername,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
        };
      }
      return null;
    } catch (error: any) {
      this.logger.error(`Username search error: ${error.message}`);
      return null;
    }
  }

  private async findById(telegramId: string): Promise<any> {
    try {
      if (!await this.ensureConnected()) {
        this.logger.warn('Cannot search by ID: not connected to Telegram');
        return null;
      }

      // Check if we have accessHash in cache
      const accessHash = this.userAccessHashCache.get(telegramId) || '0';
      console.log(`🔑 Using accessHash for ${telegramId}: ${accessHash !== '0' ? 'FOUND' : 'NOT FOUND (trying anyway)'}`);
      
      const result = await this.client.invoke(
        new Api.users.GetUsers({
          id: [
            new Api.InputUser({
              userId: big(telegramId),
              accessHash: big(accessHash),
            }),
          ],
        }),
      );

      const user = result[0] as any;
      if (user && user.className !== 'UserEmpty') {
        // Cache the accessHash for future use
        if (user.accessHash) {
          this.userAccessHashCache.set(telegramId, user.accessHash.toString());
        }
        
        return {
          telegram_id: user.id.toString(),
          username: user.username || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
        };
      }
      console.log('⚠️ User is empty or not accessible (not in contacts/dialogs)');
      return null;
    } catch (error: any) {
      console.log(`❌ ID search failed: ${error.message} - User likely not in your contacts`);
      this.logger.error(`ID search error: ${error.message}`);
      return null;
    }
  }

  private async saveOrUpdateUser(userData: any): Promise<TelegramUser> {
    const fullname = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    const telegramId = BigInt(userData.telegram_id);
    
    // Try to find existing User by phone to auto-connect
    let connectedUserId: number | null = null;
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { phone: userData.phone },
      });
      if (existingUser) {
        connectedUserId = existingUser.id;
        this.logger.log(`📱 Auto-connecting TelegramUser ${telegramId} to User ${existingUser.id} via phone ${userData.phone}`);
      }
    } catch (error) {
      this.logger.warn(`Could not auto-connect user: ${error.message}`);
    }
    
    const saved = await this.prisma.telegramUser.upsert({
      where: { telegramId },
      update: {
        phone: userData.phone,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        fullname,
        username: userData.username,
        userId: connectedUserId, // Connect if found
      },
      create: {
        telegramId,
        phone: userData.phone,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        fullname,
        username: userData.username,
        userId: connectedUserId, // Connect if found
      },
    });

    return {
      id: saved.id,
      telegramId: Number(saved.telegramId),
      phone: saved.phone,
      fullname: saved.fullname,
      username: saved.username,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
    };
  }

  async generateUsers(startPhone: string, count: number): Promise<void> {
    this.logger.log(`Starting generation from ${startPhone}, count: ${count}`);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 TELEGRAM USER GENERATION STARTED`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📱 Start phone: ${startPhone}`);
    console.log(`🔢 Count: ${count}`);
    console.log(`⏱️  Interval: Random 3-10 seconds between requests`);
    console.log(`${'='.repeat(60)}\n`);

    // Background'da ishlash uchun Promise yaratamiz lekin await qilmaymiz
    this.processGeneration(startPhone, count).catch(err => {
      console.error('Generation process error:', err);
    });
  }

  private async processGeneration(startPhone: string, count: number): Promise<void> {
    // Telefon raqamdan faqat raqamlarni ajratish
    const digitsOnly = startPhone.replace(/\D/g, '');
    let baseNumber = BigInt(digitsOnly);
    let foundCount = 0;

    for (let i = 0; i < count; i++) {
      const currentPhone = '+' + baseNumber.toString();
      const timestamp = new Date().toLocaleTimeString('uz-UZ');
      
      console.log(`\n[${timestamp}] 🔍 Request ${i + 1}/${count}`);
      console.log(`📞 Searching: ${currentPhone}`);

      try {
        const user = await this.findByPhone(currentPhone);
        if (user) {
          await this.saveOrUpdateUser(user);
          foundCount++;
          console.log(`✅ SUCCESS - User found and saved`);
          console.log(`   Name: ${user.firstName} ${user.lastName}`);
          console.log(`   Username: @${user.username || 'none'}`);
          
          // User bilan connect qilish
          await this.connectToUser(user.phone);
        } else {
          console.log(`❌ NOT FOUND - No Telegram user with this number`);
        }
      } catch (error: any) {
        console.log(`⚠️  ERROR - ${error.message}`);
      }

      // Keyingi raqam
      baseNumber = baseNumber + BigInt(1);

      // Random 3-10 sekund kutish (oxirgi zaprosdan tashqari)
      if (i < count - 1) {
        const randomDelay = Math.floor(Math.random() * (10 - 3 + 1) + 3) * 1000;
        console.log(`⏳ Waiting ${randomDelay / 1000} seconds before next request...`);
        await new Promise(resolve => setTimeout(resolve, randomDelay));
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✨ GENERATION COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📊 Total processed: ${count}`);
    console.log(`✅ Found: ${foundCount}`);
    console.log(`❌ Not found: ${count - foundCount}`);
    console.log(`${'='.repeat(60)}\n`);
    
    this.logger.log(`Generation completed. Found ${foundCount}/${count} users.`);
  }

  private async connectToUser(phone: string): Promise<void> {
    try {
      // Telefon raqam bo'yicha User topish
      const user = await this.prisma.user.findFirst({
        where: { phone },
      });

      if (!user) {
        console.log(`No User found with phone: ${phone}`);
        return;
      }

      // TelegramUser topish
      const telegramUser = await this.prisma.telegramUser.findFirst({
        where: { phone },
      });

      if (!telegramUser) {
        console.log(`No TelegramUser found with phone: ${phone}`);
        return;
      }

      // Connect qilish
      await this.prisma.telegramUser.update({
        where: { id: telegramUser.id },
        data: { userId: user.id },
      });

      console.log(`✓ Connected TelegramUser ${telegramUser.id} to User ${user.id}`);
    } catch (error: any) {
      console.log(`Connect error:`, error.message);
    }
  }

  private async searchUsers(query: string): Promise<any[]> {
    console.log('Searching Users in database for:', query);
    
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { surname: { contains: query } },
            { username: { contains: query } },
            { phone: { contains: query } },
            { pinfl: { contains: query } },
          ],
        },
        include: {
          telegramUser: true,
          phones: true,
          cards: true,
        },
        take: 20,
      });

      console.log('Found Users:', users.length);
      return users;
    } catch (error: any) {
      console.log('User search error:', error);
      this.logger.error(`User search error: ${error.message}`);
      return [];
    }
  }

  async connectTelegramUserToUser(telegramUserId: number, userId: number) {
    try {
      // Check if TelegramUser exists
      const telegramUser = await this.prisma.telegramUser.findUnique({
        where: { id: telegramUserId },
      });

      if (!telegramUser) {
        throw new Error(`TelegramUser with ID ${telegramUserId} not found`);
      }

      // Check if User exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Update TelegramUser with userId
      const updated = await this.prisma.telegramUser.update({
        where: { id: telegramUserId },
        data: { userId: userId },
      });

      this.logger.log(`✅ Connected TelegramUser ${telegramUserId} to User ${userId}`);
      
      return {
        message: 'Successfully connected',
        telegramUser: {
          id: updated.id,
          telegramId: Number(updated.telegramId),
          phone: updated.phone,
        },
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
        },
      };
    } catch (error: any) {
      this.logger.error(`Connect error: ${error.message}`);
      throw error;
    }
  }
}
