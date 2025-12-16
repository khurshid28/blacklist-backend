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
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ImageService = class ImageService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createImageDto) {
        if (!createImageDto.url) {
            throw new common_1.BadRequestException('Rasm URL majburiy');
        }
        return this.prisma.image.create({
            data: {
                userId,
                url: createImageDto.url,
                title: createImageDto.title,
                description: createImageDto.description,
                fileSize: createImageDto.fileSize,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.image.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.image.findUnique({
            where: { id },
        });
    }
    async update(id, updateData) {
        return this.prisma.image.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        return this.prisma.image.delete({
            where: { id },
        });
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImageService);
//# sourceMappingURL=image.service.js.map