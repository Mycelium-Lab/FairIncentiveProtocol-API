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
        //TODO: чекать из списка
        chainid: {
            type: 'string'
        },
        supply_type: {
            type: 'number'
        },
        max_supply: {
            type: ['null', 'string'], nullable: true
        },
        initial_supply: {
            type: ['null', 'string'], nullable: true
        },
        pausable: {
            type: 'boolean',
            default: false
        },
        burnable: {
            type: 'boolean',
            default: false
        },
        blacklist: {
            type: 'boolean',
            default: false
        },
        recoverable: {
            type: 'boolean',
            default: false
        },
        verified: {
            type: 'boolean',
            default: false
        },
        fpmanager: {
            type: 'string'
        },
        image: {
            type: ['null', 'string'], nullable: true
        }
    }
};
exports.AddTokenValidation = joi_1.default.object({
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
    chainid: joi_1.default.string()
        .required(),
    supply_type: joi_1.default.number().min(0).max(2).required(),
    //TODO: наверное тип bigint
    //TODO: может быть не allow(null) если другой supply_type
    max_supply: joi_1.default.string().allow(null),
    initial_supply: joi_1.default.string().allow(null),
    pausable: joi_1.default.boolean().required(),
    burnable: joi_1.default.boolean().required(),
    blacklist: joi_1.default.boolean().required(),
    recoverable: joi_1.default.boolean().required(),
    verified: joi_1.default.boolean().required(),
    fpmanager: joi_1.default.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(utils_1.checkAddress),
    image: joi_1.default.string().allow(null)
});
