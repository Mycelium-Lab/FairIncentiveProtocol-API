"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserValidation = exports.UpdateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
exports.UpdateUser = {
    $id: 'UpdateUser',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        company_id: {
            type: ['null', 'string'], nullable: true
        },
        external_id: {
            type: ['null', 'string'], nullable: true
        },
        email: {
            type: ['null', 'string'], nullable: true
        },
        wallet: {
            type: ['null', 'string'], nullable: true
        },
        notes: {
            type: ['null', 'string'], nullable: true
        },
        image: {
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
exports.UpdateUserValidation = joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    company_id: joi_1.default.string().uuid().allow(null),
    external_id: joi_1.default.string()
        .max(256).allow(null),
    email: joi_1.default.string()
        .email().allow(null),
    wallet: joi_1.default.string().allow(null).external(utils_1.checkAddress),
    notes: joi_1.default.string().allow(null),
    image: joi_1.default.string().allow(null),
    properties: joi_1.default.array().allow(null),
    stats: joi_1.default.array().allow(null)
});
