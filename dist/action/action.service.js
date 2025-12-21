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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const telegram_service_1 = require("../telegram/telegram.service");
let ActionService = class ActionService {
    constructor(prisma, telegramService) {
        this.prisma = prisma;
        this.telegramService = telegramService;
    }
    async createAction(clientId, createDto, isSuperAdmin) {
        if (createDto.maxCount === 0 && !isSuperAdmin) {
            throw new common_1.BadRequestException('Only SUPER admins can create unlimited actions');
        }
        const existingAction = await this.prisma.action.findFirst({
            where: {
                clientId,
                status: { in: ['PENDING', 'IN_PROGRESS'] },
            },
        });
        if (existingAction) {
            throw new common_1.BadRequestException('You already have an active action');
        }
        const action = await this.prisma.action.create({
            data: {
                clientId,
                maxCount: createDto.maxCount,
                status: 'PENDING',
            },
        });
        this.processAction(action.id).catch(console.error);
        return action;
    }
    async getActions(clientId, isSuperAdmin) {
        const where = isSuperAdmin ? {} : { clientId };
        return this.prisma.action.findMany({
            where,
            include: {
                client: {
                    select: {
                        id: true,
                        fullname: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        telegramUser: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAction(actionId, clientId, isSuperAdmin) {
        const action = await this.prisma.action.findUnique({
            where: { id: actionId },
            include: {
                client: {
                    select: {
                        id: true,
                        fullname: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        telegramUser: true,
                    },
                },
            },
        });
        if (!action) {
            throw new common_1.NotFoundException('Action not found');
        }
        if (!isSuperAdmin && action.clientId !== clientId) {
            throw new common_1.BadRequestException('Access denied');
        }
        return action;
    }
    async processAction(actionId) {
        try {
            await this.prisma.action.update({
                where: { id: actionId },
                data: { status: 'IN_PROGRESS' },
            });
            const action = await this.prisma.action.findUnique({
                where: { id: actionId },
            });
            if (!action)
                return;
            const limit = action.maxCount === 0 ? 100 : action.maxCount;
            const telegramUsers = await this.prisma.telegramUser.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' },
            });
            for (const telegramUser of telegramUsers) {
                await this.prisma.actionItem.create({
                    data: {
                        actionId: action.id,
                        telegramUserId: telegramUser.id,
                        phone: telegramUser.phone,
                    },
                });
                await this.prisma.action.update({
                    where: { id: actionId },
                    data: {
                        processedCount: { increment: 1 },
                    },
                });
            }
            await this.prisma.action.update({
                where: { id: actionId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        }
        catch (error) {
            console.error('Error processing action:', error);
            await this.prisma.action.update({
                where: { id: actionId },
                data: { status: 'FAILED' },
            });
        }
    }
};
exports.ActionService = ActionService;
exports.ActionService = ActionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], ActionService);
//# sourceMappingURL=action.service.js.map