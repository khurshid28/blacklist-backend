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
var ImageController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const image_service_1 = require("./image.service");
const create_image_dto_1 = require("./dto/create-image.dto");
const upload_service_1 = require("../upload/upload.service");
let ImageController = ImageController_1 = class ImageController {
    constructor(imageService, uploadService) {
        this.imageService = imageService;
        this.uploadService = uploadService;
        this.logger = new common_1.Logger(ImageController_1.name);
    }
    async create(userId, file, createImageDto) {
        try {
            this.logger.log(`🖼️ Rasm yuklash boshlandi - User ID: ${userId}`);
            this.logger.log(`📦 Fayl: ${file?.originalname || 'Yo\'q'}, O\'lcham: ${file?.size || 0} bytes`);
            this.logger.log(`📝 Ma\'lumotlar: ${JSON.stringify(createImageDto)}`);
            if (!file) {
                this.logger.error('❌ Fayl yuklanmadi!');
                throw new common_1.BadRequestException('Rasm fayli yuklanishi shart');
            }
            const imageUrl = `/uploads/images/${file.filename}`;
            this.logger.log(`🔗 Rasm URL yaratildi: ${imageUrl}`);
            const result = await this.imageService.create(+userId, {
                ...createImageDto,
                url: imageUrl,
                fileSize: file.size,
            });
            this.logger.log(`✅ Rasm muvaffaqiyatli saqlandi - ID: ${result.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Rasm yuklashda xatolik: ${error.message}`);
            this.logger.error(error.stack);
            throw error;
        }
    }
    findAll(userId) {
        return this.imageService.findAll(+userId);
    }
    findOne(id) {
        return this.imageService.findOne(+id);
    }
    update(id, updateData) {
        return this.imageService.update(+id, updateData);
    }
    remove(id) {
        return this.imageService.remove(+id);
    }
};
exports.ImageController = ImageController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/images',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `image-${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_image_dto_1.CreateImageDto]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "remove", null);
exports.ImageController = ImageController = ImageController_1 = __decorate([
    (0, common_1.Controller)('users/:userId/images'),
    __metadata("design:paramtypes", [image_service_1.ImageService,
        upload_service_1.UploadService])
], ImageController);
//# sourceMappingURL=image.controller.js.map