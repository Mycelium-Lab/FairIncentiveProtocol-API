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
exports.getNFTs = exports.addNFT = exports.getNFTCollections = exports.addNFTCollection = void 0;
const db_1 = __importDefault(require("../config/db"));
function addNFTCollection(nftCollection, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('erc721_tokens')
                .insert({
                company_id: getCompany.company_id,
                name: nftCollection.name,
                symbol: nftCollection.symbol,
                chain_id: nftCollection.chainid,
                address: nftCollection.address,
                beneficiary: nftCollection.address
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.addNFTCollection = addNFTCollection;
function getNFTCollections(getCompany) {
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
exports.getNFTCollections = getNFTCollections;
function addNFT(nft, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield (0, db_1.default)('erc721_tokens').select('*').where({ company_id: getCompany.company_id, address: nft.address });
            if (!collection.length)
                throw Error('Not found this collection');
            yield (0, db_1.default)('nfts').insert({
                address: nft.address,
                image: "https://gateway.pinata.cloud/ipfs/QmX9qWa4p1Te3PhdRpyyY1SSvdgY9JAjVcGX2sy8HtaFn4?_gl=1*owkaeo*rs_ga*NzVlMGVjN2MtMTExNC00MmRkLTg2ZjQtZGZkZWMyOGY3Nzg4*rs_ga_5RMPXG14TE*MTY4Mzg3OTYxNi42LjEuMTY4Mzg4MDE3Ni42MC4wLjA",
                chain_id: nft.chainid,
                amount: nft.amount,
                name: nft.name,
                description: nft.description
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
            const nfts = yield (0, db_1.default)('erc721_tokens')
                .whereRaw('erc721_tokens.company_id = ?', [getCompany.company_id])
                .join('nfts', 'nfts.address', '=', 'erc721_tokens.address')
                .select([
                'erc721_tokens.address as collection_address',
                'erc721_tokens.name as collection_name',
                'erc721_tokens.chain_id as chainid',
                'nfts.image as image',
                'nfts.id as nft_id',
                'nfts.name as nft_name',
                'nfts.description as nft_description',
                'nfts.amount as nft_amount'
            ]);
            const result = nfts.reduce((acc, item) => {
                if (!acc[item.collection_address]) {
                    acc[item.collection_address] = [];
                }
                acc[item.collection_address].push(item);
                return acc;
            }, {});
            return result;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getNFTs = getNFTs;
