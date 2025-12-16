"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramController = void 0;
const common_1 = require("@nestjs/common");
const telegram_service_1 = require("./telegram.service");
let TelegramController = class TelegramController {
    constructor(telegramService) {
        this.telegramService = telegramService;
    }
    async search(searchText) {
        if (!searchText || searchText.trim().length === 0) {
            return { telegram_users: [], users: [] };
        }
        try {
            const { telegramUsers, users } = await this.telegramService.searchUser(searchText);
            return { telegram_users: telegramUsers, users };
        }
        catch (error) {
            return { telegram_users: [], users: [], error: error.message };
        }
    }
    async generate(body) {
        const { phone, max = 10 } = body;
        if (!phone || phone.trim().length === 0) {
            return { message: 'Phone number is required', count: 0 };
        }
        const maxLimit = Math.min(max, 10);
        this.telegramService.generateUsers(phone, maxLimit).catch(err => {
            console.error('Generate error:', err);
        });
        return {
            message: `${maxLimit} ta raqam uchun Telegram qidiruv boshlandi. Har 3 sekundda 1 ta zapros yuboriladi.`,
            count: maxLimit
        };
    }
    async connectToUser(body) {
        const { telegramUserId, userId } = body;
        if (!telegramUserId || !userId) {
            return { success: false, message: 'telegramUserId and userId are required' };
        }
        try {
            const result = await this.telegramService.connectTelegramUserToUser(telegramUserId, userId);
            return { success: true, ...result };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
};
exports.TelegramController = TelegramController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('search_text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('connect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "connectToUser", null);
exports.TelegramController = TelegramController = __decorate([
    (0, common_1.Controller)('telegram'),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], TelegramController);
//# sourceMappingURL=telegram.controller.js.map