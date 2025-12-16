"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const tl_1 = require("telegram/tl");
const big_integer_1 = __importDefault(require("big-integer"));
const fs = __importStar(require("fs"));
const prisma_service_1 = require("../prisma/prisma.service");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TelegramService_1.name);
        this.sessionPath = './telegram.session';
        this.userAccessHashCache = new Map();
        this.isConnected = false;
        this.isConnecting = false;
        try {
            const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
            const apiHash = process.env.TELEGRAM_API_HASH || '';
            let session;
            if (fs.existsSync(this.sessionPath)) {
                session = new sessions_1.StringSession(fs.readFileSync(this.sessionPath, 'utf8'));
            }
            else {
                session = new sessions_1.StringSession('');
            }
            const useProxy = process.env.TELEGRAM_USE_PROXY === 'true';
            const proxyConfig = useProxy ? {
                socksType: 5,
                ip: process.env.TELEGRAM_PROXY_HOST || '127.0.0.1',
                port: parseInt(process.env.TELEGRAM_PROXY_PORT || '1080'),
                ...(process.env.TELEGRAM_PROXY_USER && {
                    username: process.env.TELEGRAM_PROXY_USER,
                    password: process.env.TELEGRAM_PROXY_PASS || '',
                }),
            } : undefined;
            this.logger.log(useProxy ? `🔒 Using SOCKS5 proxy: ${proxyConfig?.ip}:${proxyConfig?.port}` : '🌐 Direct connection');
            this.client = new telegram_1.TelegramClient(session, apiId, apiHash, {
                connectionRetries: 5,
                useWSS: false,
                timeout: 30000,
                requestRetries: 3,
                autoReconnect: false,
                retryDelay: 3000,
                maxConcurrentDownloads: 1,
                ...(proxyConfig && { proxy: proxyConfig }),
            });
        }
        catch (error) {
            this.logger.error('❌ Failed to initialize Telegram client:', error.message);
            this.logger.warn('⚠️  Telegram features will be disabled');
            this.client = null;
        }
    }
    async onModuleInit() {
        if (!this.client) {
            this.logger.warn('⚠️  Telegram client not initialized, skipping connection');
            return;
        }
        this.connectToTelegram().catch(err => {
            this.logger.error('❌ Initial Telegram connection failed:', err.message);
            this.logger.warn('⚠️  Server will continue without Telegram');
        });
    }
    async connectToTelegram() {
        if (!this.client) {
            return;
        }
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
            this.logger.log('⏱️  Attempting connection with 30s timeout...');
            const connectPromise = this.client.connect();
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout after 30s')), 30000));
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
        }
        catch (error) {
            this.logger.error('❌ Telegram connection failed:', error.message);
            this.logger.warn('⚠️  Telegram features will be disabled');
            this.isConnected = false;
            try {
                await this.client.disconnect();
            }
            catch (disconnectError) {
            }
        }
        finally {
            this.isConnecting = false;
        }
    }
    async ensureConnected() {
        if (!this.client) {
            this.logger.warn('⚠️  Telegram client not available');
            return false;
        }
        if (this.isConnected) {
            return true;
        }
        this.logger.warn('⚠️  Not connected to Telegram, attempting reconnect...');
        await this.connectToTelegram();
        return this.isConnected;
    }
    formatPhone(phone) {
        let cleaned = phone.replace(/\D/g, '');
        if (!cleaned.startsWith('998')) {
            cleaned = '998' + cleaned;
        }
        return '+' + cleaned;
    }
    async searchUser(query) {
        this.logger.log(`Search started for: ${query}`);
        console.log('=== TELEGRAM SEARCH ===');
        console.log('Query:', query);
        const telegramResults = [];
        const digitsOnly = query.replace(/\D/g, '');
        console.log('Digits only:', digitsOnly);
        if (digitsOnly.length === 9 || digitsOnly.length === 12) {
            console.log('Trying as PHONE number first...');
            try {
                const user = await this.findByPhone(query);
                if (user) {
                    const savedUser = await this.saveOrUpdateUser(user);
                    telegramResults.push(savedUser);
                    console.log('Found via PHONE search');
                }
                else {
                    console.log('Not found as phone, will try as Telegram ID if 9 digits');
                }
            }
            catch (error) {
                this.logger.error(`Phone search failed: ${error.message}`);
            }
        }
        if (/^@?\w+$/.test(query) && /[a-zA-Z]/.test(query)) {
            console.log('Detected as USERNAME');
            try {
                const user = await this.findByUsername(query);
                if (user) {
                    const savedUser = await this.saveOrUpdateUser(user);
                    telegramResults.push(savedUser);
                }
            }
            catch (error) {
                this.logger.error(`Username search failed: ${error.message}`);
            }
        }
        if (/^\d+$/.test(query) && telegramResults.length === 0) {
            console.log('Trying as TELEGRAM ID (phone search yielded nothing)');
            try {
                const user = await this.findById(digitsOnly);
                if (user) {
                    const savedUser = await this.saveOrUpdateUser(user);
                    telegramResults.push(savedUser);
                    console.log('Found via TELEGRAM ID search');
                }
                else {
                    console.log('Telegram ID search failed, will check database');
                }
            }
            catch (error) {
                this.logger.error(`ID search failed: ${error.message}, will check database`);
            }
        }
        if (telegramResults.length === 0) {
            console.log('Not found in Telegram, searching local database (including by Telegram ID)...');
            const dbResults = await this.searchInDatabase(query);
            telegramResults.push(...dbResults);
        }
        const users = await this.searchUsers(query);
        console.log('=== SEARCH RESULTS ===');
        console.log('Found telegram_users:', telegramResults.length);
        console.log('Found users:', users.length);
        return { telegramUsers: telegramResults, users };
    }
    async searchInDatabase(query) {
        console.log('Database search for:', query);
        try {
            if (!isNaN(Number(query))) {
                const telegramIdStr = query;
                const exactMatch = await this.prisma.$queryRaw `
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
                const likeResults = await this.prisma.$queryRaw `
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
            const textResults = await this.prisma.$queryRaw `
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
        }
        catch (error) {
            console.log('Database search error:', error);
            this.logger.error(`Database search error: ${error.message}`);
            return [];
        }
    }
    async findByPhone(phone) {
        try {
            if (!await this.ensureConnected()) {
                this.logger.warn('Cannot search by phone: not connected to Telegram');
                return null;
            }
            const formattedPhone = this.formatPhone(phone);
            console.log('findByPhone - Formatted:', formattedPhone);
            const result = await this.client.invoke(new tl_1.Api.contacts.ImportContacts({
                contacts: [
                    new tl_1.Api.InputPhoneContact({
                        clientId: (0, big_integer_1.default)(Date.now()),
                        phone: formattedPhone,
                        firstName: 'Search',
                        lastName: 'User',
                    }),
                ],
            }));
            console.log('findByPhone - API result:', result);
            if (result.users && result.users.length > 0) {
                const user = result.users[0];
                console.log('findByPhone - User found:', user);
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
        }
        catch (error) {
            console.log('findByPhone - Error:', error);
            this.logger.error(`Phone search error: ${error.message}`);
            return null;
        }
    }
    async findByUsername(username) {
        try {
            if (!await this.ensureConnected()) {
                this.logger.warn('Cannot search by username: not connected to Telegram');
                return null;
            }
            const cleanUsername = username.replace('@', '');
            const result = await this.client.invoke(new tl_1.Api.contacts.ResolveUsername({
                username: cleanUsername,
            }));
            const user = result.users[0];
            if (user) {
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
        }
        catch (error) {
            this.logger.error(`Username search error: ${error.message}`);
            return null;
        }
    }
    async findById(telegramId) {
        try {
            if (!await this.ensureConnected()) {
                this.logger.warn('Cannot search by ID: not connected to Telegram');
                return null;
            }
            const accessHash = this.userAccessHashCache.get(telegramId) || '0';
            console.log(`🔑 Using accessHash for ${telegramId}: ${accessHash !== '0' ? 'FOUND' : 'NOT FOUND (trying anyway)'}`);
            const result = await this.client.invoke(new tl_1.Api.users.GetUsers({
                id: [
                    new tl_1.Api.InputUser({
                        userId: (0, big_integer_1.default)(telegramId),
                        accessHash: (0, big_integer_1.default)(accessHash),
                    }),
                ],
            }));
            const user = result[0];
            if (user && user.className !== 'UserEmpty') {
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
        }
        catch (error) {
            console.log(`❌ ID search failed: ${error.message} - User likely not in your contacts`);
            this.logger.error(`ID search error: ${error.message}`);
            return null;
        }
    }
    async saveOrUpdateUser(userData) {
        const fullname = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        const telegramId = BigInt(userData.telegram_id);
        let connectedUserId = null;
        try {
            const existingUser = await this.prisma.user.findFirst({
                where: { phone: userData.phone },
            });
            if (existingUser) {
                connectedUserId = existingUser.id;
                this.logger.log(`📱 Auto-connecting TelegramUser ${telegramId} to User ${existingUser.id} via phone ${userData.phone}`);
            }
        }
        catch (error) {
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
                userId: connectedUserId,
            },
            create: {
                telegramId,
                phone: userData.phone,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                fullname,
                username: userData.username,
                userId: connectedUserId,
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
    async generateUsers(startPhone, count) {
        this.logger.log(`Starting generation from ${startPhone}, count: ${count}`);
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🚀 TELEGRAM USER GENERATION STARTED`);
        console.log(`${'='.repeat(60)}`);
        console.log(`📱 Start phone: ${startPhone}`);
        console.log(`🔢 Count: ${count}`);
        console.log(`⏱️  Interval: Random 3-10 seconds between requests`);
        console.log(`${'='.repeat(60)}\n`);
        this.processGeneration(startPhone, count).catch(err => {
            console.error('Generation process error:', err);
        });
    }
    async processGeneration(startPhone, count) {
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
                    await this.connectToUser(user.phone);
                }
                else {
                    console.log(`❌ NOT FOUND - No Telegram user with this number`);
                }
            }
            catch (error) {
                console.log(`⚠️  ERROR - ${error.message}`);
            }
            baseNumber = baseNumber + BigInt(1);
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
    async connectToUser(phone) {
        try {
            const user = await this.prisma.user.findFirst({
                where: { phone },
            });
            if (!user) {
                console.log(`No User found with phone: ${phone}`);
                return;
            }
            const telegramUser = await this.prisma.telegramUser.findFirst({
                where: { phone },
            });
            if (!telegramUser) {
                console.log(`No TelegramUser found with phone: ${phone}`);
                return;
            }
            await this.prisma.telegramUser.update({
                where: { id: telegramUser.id },
                data: { userId: user.id },
            });
            console.log(`✓ Connected TelegramUser ${telegramUser.id} to User ${user.id}`);
        }
        catch (error) {
            console.log(`Connect error:`, error.message);
        }
    }
    async searchUsers(query) {
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
        }
        catch (error) {
            console.log('User search error:', error);
            this.logger.error(`User search error: ${error.message}`);
            return [];
        }
    }
    async connectTelegramUserToUser(telegramUserId, userId) {
        try {
            const telegramUser = await this.prisma.telegramUser.findUnique({
                where: { id: telegramUserId },
            });
            if (!telegramUser) {
                throw new Error(`TelegramUser with ID ${telegramUserId} not found`);
            }
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }
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
        }
        catch (error) {
            this.logger.error(`Connect error: ${error.message}`);
            throw error;
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map