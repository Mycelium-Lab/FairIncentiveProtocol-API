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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNFTs = exports.addNFT = void 0;
const db_1 = __importDefault(require("../config/db"));
function addNFT(nft, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('erc721_tokens')
                .insert({
                company_id: getCompany.company_id,
                name: nft.name,
                symbol: nft.symbol,
                chain_id: nft.chainid,
                address: nft.address,
                beneficiary: nft.address
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.addNFT = addNFT;
function getNFTs(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokens = yield (0, db_1.default)('erc721_tokens')
                .select('*')
                .where({
                company_id: getCompany.company_id
            });
            return tokens;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getNFTs = getNFTs;
