"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAddress = void 0;
const ethers_1 = require("ethers");
function checkAddress(wallet, helpers) {
    if (!helpers.schema._valids._values.has(null)) {
        const _isAddress = ethers_1.utils.isAddress(wallet);
        if (!_isAddress) {
            throw Error('Wallet is incorrect');
        }
    }
}
exports.checkAddress = checkAddress;
