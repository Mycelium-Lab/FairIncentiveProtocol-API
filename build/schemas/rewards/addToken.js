"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTokenRewardValidation = exports.AddTokenReward = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
exports.AddTokenReward = {
    $id: 'AddTokenReward',
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        address: {
            type: 'string'
        },
        amount: {
            type: 'string'
        }
    }
};
exports.AddTokenRewardValidation = joi_1.default.object({
    address: joi_1.default.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(utils_1.checkAddress),
    description: joi_1.default.string().allow(null),
    name: joi_1.default.string()
        .required(),
    amount: joi_1.default.string()
        .required(),
    chainid: joi_1.default.string()
        .required()
        .external(utils_1.checkChainID)
});
