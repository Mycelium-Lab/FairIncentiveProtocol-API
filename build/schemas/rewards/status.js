"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusValidation = exports.Status = void 0;
const joi_1 = __importDefault(require("joi"));
exports.Status = {
    $id: 'Status',
    type: 'object',
    properties: {
        reward_id: {
            type: 'string'
        },
        status: {
            type: 'number'
        }
    }
};
exports.StatusValidation = joi_1.default.object({
    reward_id: joi_1.default.string().uuid().required(),
    status: joi_1.default.number().min(0).max(1).required()
});
