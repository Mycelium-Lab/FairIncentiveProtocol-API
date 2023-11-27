"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNFTValidation = exports.AddNFT = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
exports.AddNFT = {
    $id: 'AddNFT',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        amount: {
            type: ['null', 'number'], nullable: true
        },
        name: {
            type: 'string'
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        properties: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    value: { type: 'string' }
                }
            }
        },
        stats: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    value: { type: 'number' }
                }
            }
        }
    }
};
exports.AddNFTValidation = joi_1.default.object({
    address: joi_1.default.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(utils_1.checkAddress),
    amount: joi_1.default.number().allow(null),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().allow(null),
    chainid: joi_1.default.string()
        .required()
        .external(utils_1.checkChainID),
    properties: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().required(),
        value: joi_1.default.string().required(),
    })),
    stats: joi_1.default.array().items(joi_1.default.object({
        name: joi_1.default.string().required(),
        value: joi_1.default.number().required(),
    }))
});
