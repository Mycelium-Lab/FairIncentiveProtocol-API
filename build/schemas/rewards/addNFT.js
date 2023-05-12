"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNFTRewardValidation = exports.AddNFTReward = void 0;
const ethers_1 = require("ethers");
const joi_1 = __importDefault(require("joi"));
exports.AddNFTReward = {
    $id: 'AddNFTReward',
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        nft_id: {
            type: 'string'
        }
    }
};
exports.AddNFTRewardValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().allow(null, ''),
    nft_id: joi_1.default.string().uuid().required()
});
function checkAddress(wallet) {
    const _isAddress = ethers_1.utils.isAddress(wallet);
    if (!_isAddress) {
        throw Error('Wallet is incorrect');
    }
}
