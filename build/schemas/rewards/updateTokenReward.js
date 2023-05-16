"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTokenRewardValidation = exports.UpdateTokenReward = void 0;
const joi_1 = __importDefault(require("joi"));
const add_1 = require("../users/add");
exports.UpdateTokenReward = {
    $id: 'UpdateTokenReward',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: ['null', 'string'], nullable: true
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        address: {
            type: ['null', 'string'], nullable: true
        },
        amount: {
            type: ['null', 'number'], nullable: true
        }
    }
};
exports.UpdateTokenRewardValidation = joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    name: joi_1.default.string().allow(null, ''),
    description: joi_1.default.string().allow(null, ''),
    address: joi_1.default.string().allow(null, '').external(add_1.checkAddress),
    amount: joi_1.default.number().allow(null, '')
});
