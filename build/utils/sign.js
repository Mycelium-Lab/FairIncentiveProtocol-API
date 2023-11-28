"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTokenReward = exports.signNFTReward = void 0;
const ethers_1 = require("ethers");
//TODO: Добавить тип Address и BigInt
function signNFTReward(uri, sender, signer, contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = [uri, sender, contractAddress];
        const hashMessage = ethers_1.ethers.utils.solidityKeccak256([
            "string", "uint160", "uint160"
        ], message);
        const sign = yield signer.signMessage(ethers_1.ethers.utils.arrayify(hashMessage));
        const r = sign.substr(0, 66);
        const s = `0x${sign.substr(66, 64)}`;
        const v = parseInt(`0x${sign.substr(130, 2)}`);
        return { r, s, v };
    });
}
exports.signNFTReward = signNFTReward;
function signTokenReward(rewardEventId, amount, senderAddress, signer, managerAddress, tokenAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = [amount, senderAddress, tokenAddress, managerAddress, rewardEventId];
        const hashMessage = ethers_1.ethers.utils.solidityKeccak256([
            "uint256", "uint160", "uint160", "uint160", "string"
        ], message);
        const sign = yield signer.signMessage(ethers_1.ethers.utils.arrayify(hashMessage));
        const r = sign.substr(0, 66);
        const s = `0x${sign.substr(66, 64)}`;
        const v = parseInt(`0x${sign.substr(130, 2)}`);
        return { r, s, v };
    });
}
exports.signTokenReward = signTokenReward;
