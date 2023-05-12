"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCompanyWalletValidation = exports.ChangeCompanyWallet = void 0;
const joi_1 = __importDefault(require("joi"));
const ethers_1 = require("ethers");
exports.ChangeCompanyWallet = {
    $id: 'ChangeCompanyWallet',
    type: 'object',
    properties: {
        newWallet: {
            type: 'string'
        }
    }
};
exports.ChangeCompanyWalletValidation = joi_1.default.object({
    newWallet: joi_1.default.string()
        .external(checkAddress)
});
function checkAddress(wallet) {
    const _isAddress = ethers_1.utils.isAddress(wallet);
    if (!_isAddress) {
        throw Error('Wallet is incorrect');
    }
}
