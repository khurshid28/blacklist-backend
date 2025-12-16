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
exports.PhoneController = void 0;
const common_1 = require("@nestjs/common");
const phone_service_1 = require("./phone.service");
const create_phone_dto_1 = require("./dto/create-phone.dto");
const update_phone_dto_1 = require("./dto/update-phone.dto");
let PhoneController = class PhoneController {
    constructor(phoneService) {
        this.phoneService = phoneService;
    }
    create(createPhoneDto) {
        return this.phoneService.create(createPhoneDto);
    }
    findAll() {
        return this.phoneService.findAll();
    }
    findByUserId(userId) {
        return this.phoneService.findByUserId(userId);
    }
    findOne(id) {
        return this.phoneService.findOne(id);
    }
    update(id, updatePhoneDto) {
        return this.phoneService.update(id, updatePhoneDto);
    }
    remove(id) {
        return this.phoneService.remove(id);
    }
};
exports.PhoneController = PhoneController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_phone_dto_1.CreatePhoneDto]),
    __metadata("design:returntype", void 0)
], PhoneController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhoneController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_phone_dto_1.UpdatePhoneDto]),
    __metadata("design:returntype", void 0)
], PhoneController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhoneController.prototype, "remove", null);
exports.PhoneController = PhoneController = __decorate([
    (0, common_1.Controller)('phones'),
    __metadata("design:paramtypes", [phone_service_1.PhoneService])
], PhoneController);
//# sourceMappingURL=phone.controller.js.map