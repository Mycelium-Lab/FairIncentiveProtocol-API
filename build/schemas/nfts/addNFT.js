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
        chainid: {
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
    chainid: joi_1.default.string()
        .required(),
    amount: joi_1.default.number().allow(null),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().allow(null)
});
