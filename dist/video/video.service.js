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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VideoService = class VideoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createVideoDto) {
        if (!createVideoDto.url) {
            throw new common_1.BadRequestException('Video URL majburiy');
        }
        return this.prisma.video.create({
            data: {
                userId,
                url: createVideoDto.url,
                title: createVideoDto.title,
                description: createVideoDto.description,
                duration: createVideoDto.duration,
                fileSize: createVideoDto.fileSize,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.video.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.video.findUnique({
            where: { id },
        });
    }
    async update(id, updateData) {
        return this.prisma.video.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        return this.prisma.video.delete({
            where: { id },
        });
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoService);
//# sourceMappingURL=video.service.js.map