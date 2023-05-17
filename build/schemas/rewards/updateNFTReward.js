"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNFTRewardValidation = exports.UpdateNFTReward = void 0;
const joi_1 = __importDefault(require("joi"));
const add_1 = require("../users/add");
exports.UpdateNFTReward = {
    $id: 'UpdateNFTReward',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: ['null', 'string'], nullable: true
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        address: {
            type: ['null', 'string'], nullable: true
        },
        nft_id: {
            type: ['null', 'number'], nullable: true
        }
    }
};
exports.UpdateNFTRewardValidation = joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    name: joi_1.default.string().allow(null, ''),
    description: joi_1.default.string().allow(null, ''),
    address: joi_1.default.string().allow(null, '').external(add_1.checkAddress),
    nft_id: joi_1.default.string().uuid().allow(null, '')
});
