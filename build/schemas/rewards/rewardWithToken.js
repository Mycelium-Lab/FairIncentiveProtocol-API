"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardWithTokenValidation = exports.RewardWithToken = void 0;
const joi_1 = __importDefault(require("joi"));
exports.RewardWithToken = {
    $id: 'RewardWithToken',
    type: 'object',
    properties: {
        reward_id: {
            type: 'string'
        },
        user_id: {
            type: 'string'
        },
        comment: {
            type: ['null', 'string'], nullable: true
        }
    }
};
exports.RewardWithTokenValidation = joi_1.default.object({
    reward_id: joi_1.default.string().uuid().required(),
    user_id: joi_1.default.string().uuid().required(),
    comment: joi_1.default.string().allow(null, '')
});
