"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhoneDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_phone_dto_1 = require("./create-phone.dto");
class UpdatePhoneDto extends (0, mapped_types_1.PartialType)(create_phone_dto_1.CreatePhoneDto) {
}
exports.UpdatePhoneDto = UpdatePhoneDto;
//# sourceMappingURL=update-phone.dto.js.map