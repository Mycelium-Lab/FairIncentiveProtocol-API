"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNFTCollectionValidation = exports.AddNFTCollection = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
exports.AddNFTCollection = {
    $id: 'AddNFTCollection',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        symbol: {
            type: 'string'
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        chainid: {
            type: 'string'
        },
        beneficiary: {
            type: ['null', 'string'], nullable: true
        },
        royalties: {
            type: 'number'
        },
        links: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    link: { type: 'string' }
                }
            }
        }
    }
};
exports.AddNFTCollectionValidation = joi_1.default.object({
    address: joi_1.default.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(utils_1.checkAddress),
    name: joi_1.default.string()
        .required(),
    symbol: joi_1.default.string()
        .required(),
    description: joi_1.default.string().allow(null).max(1000),
    chainid: joi_1.default.string()
        .required()
        .external(utils_1.checkChainID),
    beneficiary: joi_1.default.string().allow(null).external(utils_1.checkAddress),
    royalties: joi_1.default.number().required(),
    links: joi_1.default.array().items(joi_1.default.object({
        link: joi_1.default.string().required()
    })),
});
