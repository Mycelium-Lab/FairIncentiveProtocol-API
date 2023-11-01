"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCountry = exports.checkChainID = exports.checkAddress = void 0;
const ethers_1 = require("ethers");
const country_list_1 = require("country-list");
const chainids = ['137', '80001', '56', '1', '43114', '42161', '10', '5', '97'];
function checkAddress(wallet, helpers) {
    if (!helpers.schema._valids._values.has(null)) {
        if (wallet === '')
            throw Error("Wallet can't be null");
        const _isAddress = ethers_1.utils.isAddress(wallet);
        if (!_isAddress) {
            throw Error('Wallet is incorrect');
        }
    }
}
exports.checkAddress = checkAddress;
function checkChainID(chainid, helpers) {
    if (!chainids.find(v => v === chainid)) {
        throw Error('Unknown (chainid) for the application, use these: 137 (Polygon), 56 (BNB), 1 (Ethereum), 43114 (Avalanche), 42161 (Arbitrum), 10 (Optimism)');
    }
}
exports.checkChainID = checkChainID;
function checkCountry(country, helpers) {
    if ((0, country_list_1.getName)(country) === undefined) {
        throw Error('Country code is incorrect');
    }
}
exports.checkCountry = checkCountry;
