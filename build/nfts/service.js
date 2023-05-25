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
exports.deleteNFT = exports.getNFTs = exports.addNFT = exports.getNFTCollections = exports.addNFTCollection = void 0;
const db_1 = __importDefault(require("../config/db"));
function addNFTCollection(nftCollection, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trx = yield db_1.default.transaction();
            const newCollection = yield trx('erc721_tokens')
                .insert({
                company_id: getCompany.company_id,
                name: nftCollection.name,
                symbol: nftCollection.symbol,
                description: nftCollection.description,
                chainid: nftCollection.chainid,
                address: nftCollection.address,
                beneficiary: nftCollection.beneficiary,
                royalty_percent: nftCollection.royalties
            }, '*')
                .then((collections) => __awaiter(this, void 0, void 0, function* () {
                nftCollection.links.forEach(v => {
                    v.company_id = getCompany.company_id;
                    v.token_address = nftCollection.address;
                    v.chainid = nftCollection.chainid;
                });
                if (nftCollection.links.length)
                    yield trx('social_links').insert(nftCollection.links);
                return collections;
            }))
                .then((collections) => __awaiter(this, void 0, void 0, function* () {
                yield trx.commit();
                return collections;
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                console.log(err);
                yield trx.rollback();
                return null;
            }));
            return newCollection ? newCollection[0] : null;
        }
        catch (error) {
            console.log(error);
            return null;
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
                chainid: nft.chainid,
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
            //TODO: Попробовать убрать reduce чтобы все было в запрос
            //сейчас reduce нужен чтобы объединять nft по коллекциям
            const nfts = yield (0, db_1.default)('erc721_tokens')
                .whereRaw('erc721_tokens.company_id = ?', [getCompany.company_id])
                .join('nfts', 'nfts.address', '=', 'erc721_tokens.address')
                .leftJoin('rewards_erc721', 'rewards_erc721.nft_id', '=', 'nfts.id')
                .groupBy('erc721_tokens.address', 'erc721_tokens.name', 'erc721_tokens.chainid', 'nfts.image', 'nfts.id', 'nfts.name', 'nfts.description', 'nfts.amount')
                .select([
                'erc721_tokens.address as collection_address',
                'erc721_tokens.name as collection_name',
                'erc721_tokens.chainid as chainid',
                'nfts.image as image',
                'nfts.id as nft_id',
                'nfts.name as nft_name',
                'nfts.description as nft_description',
                'nfts.amount as nft_amount',
                db_1.default.raw('COUNT(DISTINCT rewards_erc721.nft_id) as rewards_count') // Изменяем подсчет на COUNT(DISTINCT)
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
function deleteNFT(nft, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const company = yield (0, db_1.default)('nfts')
                .whereRaw('nfts.id = ?', [nft.id])
                .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
                .first()
                .select('erc721_tokens.company_id as id');
            if (company.id !== getCompany.company_id)
                throw Error('Not your nft');
            const reward = yield (0, db_1.default)('rewards_erc721').where({ nft_id: nft.id }).select('*');
            if (reward.length)
                throw Error('This nft in reward');
            yield (0, db_1.default)('nfts').where({ id: nft.id }).delete();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.deleteNFT = deleteNFT;
