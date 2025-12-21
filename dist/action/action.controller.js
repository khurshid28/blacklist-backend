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
exports.ActionController = void 0;
const common_1 = require("@nestjs/common");
const action_service_1 = require("./action.service");
const create_action_dto_1 = require("./dto/create-action.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let ActionController = class ActionController {
    constructor(actionService) {
        this.actionService = actionService;
    }
    async createAction(req, createDto) {
        const isSuperAdmin = req.user.role === 'SUPER';
        return this.actionService.createAction(req.user.id, createDto, isSuperAdmin);
    }
    async getActions(req) {
        const isSuperAdmin = req.user.role === 'SUPER';
        return this.actionService.getActions(req.user.id, isSuperAdmin);
    }
    async getAction(req, id) {
        const isSuperAdmin = req.user.role === 'SUPER';
        return this.actionService.getAction(+id, req.user.id, isSuperAdmin);
    }
};
exports.ActionController = ActionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_action_dto_1.CreateActionDto]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "createAction", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "getActions", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ActionController.prototype, "getAction", null);
exports.ActionController = ActionController = __decorate([
    (0, common_1.Controller)('actions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [action_service_1.ActionService])
], ActionController);
//# sourceMappingURL=action.controller.js.map