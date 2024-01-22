"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenForDistValidation = exports.TokenForDist = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
exports.TokenForDist = {
    $id: 'TokenForDist',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        chainid: {
            type: 'string'
        },
        startDate: {
            type: 'string'
        },
        endData: {
            type: 'string'
        }
    }
};
exports.TokenForDistValidation = joi_1.default.object({
    address: joi_1.default.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(utils_1.checkAddress),
    chainid: joi_1.default.string()
        .required()
        .external(utils_1.checkChainID),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required()
});
