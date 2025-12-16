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
var VideoController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const video_service_1 = require("./video.service");
const create_video_dto_1 = require("./dto/create-video.dto");
const upload_service_1 = require("../upload/upload.service");
let VideoController = VideoController_1 = class VideoController {
    constructor(videoService, uploadService) {
        this.videoService = videoService;
        this.uploadService = uploadService;
        this.logger = new common_1.Logger(VideoController_1.name);
    }
    async create(userId, file, createVideoDto) {
        try {
            this.logger.log(`📹 Video yuklash boshlandi - User ID: ${userId}`);
            this.logger.log(`📦 Fayl: ${file?.originalname || 'Yo\'q'}, O\'lcham: ${file?.size || 0} bytes`);
            this.logger.log(`📝 Ma\'lumotlar: ${JSON.stringify(createVideoDto)}`);
            if (!file) {
                this.logger.error('❌ Fayl yuklanmadi!');
                throw new common_1.BadRequestException('Video fayli yuklanishi shart');
            }
            const videoUrl = `/uploads/videos/${file.filename}`;
            this.logger.log(`🔗 Video URL yaratildi: ${videoUrl}`);
            const result = await this.videoService.create(+userId, {
                ...createVideoDto,
                url: videoUrl,
                fileSize: file.size,
            });
            this.logger.log(`✅ Video muvaffaqiyatli saqlandi - ID: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Video yuklashda xatolik: ${error.message}`);
            this.logger.error(error.stack);
            throw error;
        }
    }
    findAll(userId) {
        return this.videoService.findAll(+userId);
    }
    findOne(id) {
        return this.videoService.findOne(+id);
    }
    update(id, updateData) {
        return this.videoService.update(+id, updateData);
    }
    remove(id) {
        return this.videoService.remove(+id);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/videos',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `video-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_video_dto_1.CreateVideoDto]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "remove", null);
exports.VideoController = VideoController = VideoController_1 = __decorate([
    (0, common_1.Controller)('users/:userId/videos'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        upload_service_1.UploadService])
], VideoController);
//# sourceMappingURL=video.controller.js.map