"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTokenValidation = exports.AddToken = void 0;
const ethers_1 = require("ethers");
const joi_1 = __importDefault(require("joi"));
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
        .external(checkAddress),
    name: joi_1.default.string()
        .required(),
    symbol: joi_1.default.string()
        .required(),
    chainid: joi_1.default.string()
        .required()
});
function checkAddress(wallet) {
    const _isAddress = (0, ethers_1.isAddress)(wallet);
    if (!_isAddress) {
        throw Error('Wallet is incorrect');
    }
}
