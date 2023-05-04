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
const ethers_1 = require("ethers");
let Joi = joi.extend(joi_phone_number_1.default);
exports.AddUser = {
    $id: 'AddUser',
    type: 'object',
    properties: {
        firstname: {
            type: 'string'
        },
        lastname: {
            type: 'string'
        },
        patronymic: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        wallet: {
            type: 'string'
        }
    }
};
exports.AddUserValidation = Joi.object({
    firstname: Joi.string()
        .max(256)
        .required(),
    lastname: Joi.string(),
    patronymic: Joi.string(),
    email: Joi.string()
        .email()
        .required(),
    wallet: Joi.string()
        .external(checkAddress)
        .required()
});
function checkAddress(wallet) {
    const _isAddress = (0, ethers_1.isAddress)(wallet);
    if (!_isAddress) {
        throw Error('Wallet is incorrect');
    }
}
