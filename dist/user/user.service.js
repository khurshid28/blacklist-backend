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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const { telegramUserId, phones, cards, ...userData } = createUserDto;
        console.log('📥 Creating user with phones and cards:', {
            userData,
            phones: phones?.length || 0,
            cards: cards?.length || 0
        });
        const user = await this.prisma.user.create({
            data: {
                ...userData,
                phones: phones?.length ? {
                    create: phones.map(p => ({ phone: p.phone }))
                } : undefined,
                cards: cards?.length ? {
                    create: cards.map(c => ({
                        bankName: c.bankName,
                        number: c.number,
                        expired: c.expired
                    }))
                } : undefined,
            },
            include: {
                phones: true,
                cards: true,
                telegramUser: true,
            },
        });
        console.log(`✅ User created with ${user.phones.length} phones and ${user.cards.length} cards`);
        if (telegramUserId) {
            try {
                await this.prisma.telegramUser.update({
                    where: { id: telegramUserId },
                    data: { userId: user.id },
                });
                console.log(`✅ Connected TelegramUser ${telegramUserId} to User ${user.id}`);
                const updatedUser = await this.prisma.user.findUnique({
                    where: { id: user.id },
                    include: {
                        phones: true,
                        cards: true,
                        telegramUser: true,
                    },
                });
                return updatedUser;
            }
            catch (error) {
                console.error(`❌ Failed to connect TelegramUser ${telegramUserId}:`, error.message);
            }
        }
        return user;
    }
    async findAll() {
        return this.prisma.user.findMany({
            include: {
                phones: true,
                cards: true,
                telegramUser: true,
                partners: {
                    select: {
                        id: true,
                        userId: true,
                        partnerId: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                comments: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                videos: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                images: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
    }
    async search(query) {
        if (!query || query.length < 2) {
            return [];
        }
        return this.prisma.user.findMany({
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
                phones: true,
                cards: true,
                telegramUser: true,
            },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                phones: true,
                cards: true,
                telegramUser: true,
                partners: {
                    include: {
                        partner: {
                            include: {
                                phones: true,
                                cards: true,
                                telegramUser: true,
                            },
                        },
                    },
                },
                comments: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                videos: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                images: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        const { phones, cards, ...userData } = updateUserDto;
        return this.prisma.user.update({
            where: { id },
            data: userData,
            include: {
                phones: true,
                cards: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async addPartners(userId, partnerIds) {
        await this.findOne(userId);
        const validPartnerIds = partnerIds.filter(partnerId => partnerId !== userId);
        const createPromises = [];
        for (const partnerId of validPartnerIds) {
            createPromises.push(this.prisma.userPartner.upsert({
                where: {
                    userId_partnerId: {
                        userId,
                        partnerId,
                    },
                },
                create: {
                    userId,
                    partnerId,
                },
                update: {},
            }));
            createPromises.push(this.prisma.userPartner.upsert({
                where: {
                    userId_partnerId: {
                        userId: partnerId,
                        partnerId: userId,
                    },
                },
                create: {
                    userId: partnerId,
                    partnerId: userId,
                },
                update: {},
            }));
        }
        await Promise.all(createPromises);
        return this.getPartners(userId);
    }
    async getPartners(userId) {
        const userWithPartners = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                partners: {
                    include: {
                        partner: {
                            include: {
                                phones: true,
                                cards: true,
                                telegramUser: true,
                            },
                        },
                    },
                },
            },
        });
        if (!userWithPartners) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return userWithPartners.partners.map(up => ({
            id: up.id,
            partnerId: up.partnerId,
            createdAt: up.createdAt,
            partner: up.partner,
        }));
    }
    async removePartner(userId, partnerId) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const deleted1 = await prisma.userPartner.deleteMany({
                    where: {
                        userId,
                        partnerId,
                    },
                });
                const deleted2 = await prisma.userPartner.deleteMany({
                    where: {
                        userId: partnerId,
                        partnerId: userId,
                    },
                });
                return {
                    userToPartner: deleted1.count,
                    partnerToUser: deleted2.count,
                };
            });
            console.log(`✅ Partnership removed: User ${userId} ↔ Partner ${partnerId}`, `(Deleted: ${result.userToPartner + result.partnerToUser} relations)`);
            return {
                message: 'Partnership removed successfully from both sides',
                details: result,
            };
        }
        catch (error) {
            console.error(`❌ Failed to remove partnership: ${error.message}`);
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map