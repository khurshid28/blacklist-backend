"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./user/user.module");
const phone_module_1 = require("./phone/phone.module");
const card_module_1 = require("./card/card.module");
const telegram_module_1 = require("./telegram/telegram.module");
const comment_module_1 = require("./comment/comment.module");
const video_module_1 = require("./video/video.module");
const image_module_1 = require("./image/image.module");
const upload_module_1 = require("./upload/upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            upload_module_1.UploadModule,
            user_module_1.UserModule,
            phone_module_1.PhoneModule,
            card_module_1.CardModule,
            telegram_module_1.TelegramModule,
            comment_module_1.CommentModule,
            video_module_1.VideoModule,
            image_module_1.ImageModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map