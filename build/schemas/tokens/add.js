"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTokenValidation = exports.AddToken = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
exports.AddToken = {
    $id: 'AddToken',
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
        chainid: {
            type: 'string'
        }
    }
};
exports.AddTokenValidation = joi_1.default.object({
    address: joi_1.default.string()
        .min(42)
        .max(42)
        .required()
        .external(utils_1.checkAddress),
    name: joi_1.default.string()
        .required(),
    symbol: joi_1.default.string()
        .required(),
    chainid: joi_1.default.string()
        .required()
});
