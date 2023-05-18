"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserValidation = exports.AddUser = void 0;
const joi = __importStar(require("joi"));
const joi_phone_number_1 = __importDefault(require("joi-phone-number"));
const utils_1 = require("../utils");
let Joi = joi.extend(joi_phone_number_1.default);
exports.AddUser = {
    $id: 'AddUser',
    type: 'object',
    properties: {
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
exports.AddUserValidation = Joi.object({
    external_id: Joi.string()
        .max(256)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    wallet: Joi.string()
        .external(utils_1.checkAddress)
        .required(),
    notes: Joi.string().allow(null),
    properties: Joi.array().allow(null),
    stats: Joi.array().allow(null)
});
