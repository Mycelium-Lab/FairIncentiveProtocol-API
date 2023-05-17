"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAddress = exports.EditUserValidation = exports.EditUser = void 0;
const joi_1 = __importDefault(require("joi"));
const ethers_1 = require("ethers");
exports.EditUser = {
    $id: 'EditUser',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        external_id: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        wallet: {
            type: 'string'
        },
        notes: {
            type: ['null', 'string'], nullable: true
        },
        properties: {
            type: 'array',
            items: {
                type: 'object'
            },
            default: []
        },
        stats: {
            type: 'array',
            items: {
                type: 'object'
            },
            default: []
        }
    }
};
exports.EditUserValidation = joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    external_id: joi_1.default.string()
        .max(256)
        .required(),
    email: joi_1.default.string()
        .email()
        .required(),
    wallet: joi_1.default.string()
        .external(checkAddress)
        .required(),
    notes: joi_1.default.string().allow(null, ''),
    properties: joi_1.default.array().allow(null),
    stats: joi_1.default.array().allow(null)
});
function checkAddress(wallet) {
    const _isAddress = ethers_1.utils.isAddress(wallet);
    if (!_isAddress) {
        throw Error('Wallet is incorrect');
    }
}
exports.checkAddress = checkAddress;
