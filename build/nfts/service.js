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
exports.deleteNFT = exports.getNFTsOneCollection = exports.getNFTs = exports.addNFT = exports.getNFTCollections = exports.addNFTCollection = void 0;
const db_1 = __importDefault(require("../config/db"));
const constants_1 = require("../utils/constants");
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
                royalty_percent: nftCollection.royalties,
                logo_image: nftCollection.logo_image,
                featured_image: nftCollection.featured_image,
                banner_image: nftCollection.banner_image
            }, '*')
                .then((collections) => __awaiter(this, void 0, void 0, function* () {
                nftCollection.links.forEach(v => {
                    v.company_id = getCompany.company_id;
                    v.token_address = nftCollection.address;
                    v.chainid = nftCollection.chainid;
                });
                if (nftCollection.links.length)
                    yield trx('social_links').insert(nftCollection.links);
                return collections[0];
            }))
                .then((collection) => __awaiter(this, void 0, void 0, function* () {
                yield trx.commit();
                return collection;
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                yield trx.rollback();
                return err.message;
            }));
            //If there is no error
            if (!(newCollection instanceof String)) {
                const res = {
                    code: constants_1.CODES.OK.code,
                    body: {
                        message: 'The NFT collection was successfully added',
                        type: constants_1.SuccessResponseTypes.object,
                        data: newCollection
                    }
                };
                return res;
            }
            else {
                const err = {
                    code: constants_1.CODES.INTERNAL_ERROR.code,
                    error: {
                        name: constants_1.CODES.INTERNAL_ERROR.name,
                        message: newCollection.toString()
                    }
                };
                return err;
            }
        }
        catch (error) {
            console.log(error.message);
            const err = {
                code: constants_1.CODES.INTERNAL_ERROR.code,
                error: {
                    name: constants_1.CODES.INTERNAL_ERROR.name,
                    message: error.message
                }
            };
            return err;
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
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'NFT Collections',
                    type: constants_1.SuccessResponseTypes.array,
                    data: tokens
                }
            };
            return res;
        }
        catch (error) {
            console.log(error.message);
            const err = {
                code: constants_1.CODES.INTERNAL_ERROR.code,
                error: {
                    name: constants_1.CODES.INTERNAL_ERROR.name,
                    message: error.message
                }
            };
            return err;
        }
    });
}
exports.getNFTCollections = getNFTCollections;
function addNFT(nft, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield (0, db_1.default)('erc721_tokens').select('*').where({ company_id: getCompany.company_id, address: nft.address });
            if (collection.length === 0)
                throw Error("The collection with this company and address was not found");
            const nfts = yield (0, db_1.default)('nfts').insert({
                address: nft.address,
                image: nft.image,
                amount: nft.amount,
                name: nft.name,
                description: nft.description,
                chainid: nft.chainid
            }, '*');
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'The NFT was successfully added',
                    type: constants_1.SuccessResponseTypes.object,
                    data: nfts[0]
                }
            };
            return res;
        }
        catch (error) {
            console.log(error.message);
            const err = {
                code: constants_1.CODES.INTERNAL_ERROR.code,
                error: {
                    name: constants_1.CODES.INTERNAL_ERROR.name,
                    message: error.message
                }
            };
            return err;
        }
    });
}
exports.addNFT = addNFT;
function getNFTs(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, db_1.default)('erc721_tokens')
                .whereRaw('erc721_tokens.company_id = ?', [getCompany.company_id])
                .select([
                'erc721_tokens.address as collection_address',
                'erc721_tokens.name as collection_name',
                db_1.default.raw(`
                    ARRAY(
                        SELECT JSON_BUILD_OBJECT(
                            'id', nfts.id,
                            'image', nfts.image,
                            'name', nfts.name,
                            'description', nfts.description,
                            'amount', nfts.amount,
                            'count', COUNT(rewards_erc721.nft_id)
                        )
                        FROM nfts
                        LEFT JOIN rewards_erc721 ON rewards_erc721.nft_id = nfts.id AND rewards_erc721.nft_id IS NOT NULL
                        WHERE nfts.address = erc721_tokens.address
                        GROUP BY nfts.id
                    ) as nfts
                `)
            ]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'NFTs',
                    type: constants_1.SuccessResponseTypes.array,
                    data: result
                }
            };
            return res;
        }
        catch (error) {
            console.log(error);
            const err = {
                code: constants_1.CODES.INTERNAL_ERROR.code,
                error: {
                    name: constants_1.CODES.INTERNAL_ERROR.name,
                    message: error.message
                }
            };
            return err;
        }
    });
}
exports.getNFTs = getNFTs;
function getNFTsOneCollection(getCompany, getOneCollectionNft) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, db_1.default)('erc721_tokens')
                .select([
                'nfts.address as collection_address',
                'nfts.image as collection_image',
                'erc721_tokens.name as collection_name',
                'erc721_tokens.chainid',
                'nfts.image',
                'nfts.id as nft_id',
                'nfts.name as nft_name',
                'nfts.description as nft_description',
                'nfts.amount as nft_amount'
            ])
                .count('reward_event_erc721.id as rewards_count')
                .from('erc721_tokens')
                .join('nfts', function () {
                this.on('erc721_tokens.chainid', '=', 'nfts.chainid')
                    .andOn('erc721_tokens.address', '=', 'nfts.address');
            })
                .leftJoin('rewards_erc721', 'nfts.id', 'rewards_erc721.nft_id')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .where({
                'erc721_tokens.company_id': getCompany.company_id,
                'erc721_tokens.address': getOneCollectionNft.address,
                'erc721_tokens.chainid': getOneCollectionNft.chainid
            })
                .groupBy('nfts.address', 'nfts.image', 'nfts.name', 'erc721_tokens.chainid', 'erc721_tokens.name', 'nfts.id');
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'NFTs',
                    type: constants_1.SuccessResponseTypes.array,
                    data: result
                }
            };
            return res;
        }
        catch (error) {
            console.log(error);
            const err = {
                code: constants_1.CODES.INTERNAL_ERROR.code,
                error: {
                    name: constants_1.CODES.INTERNAL_ERROR.name,
                    message: error.message
                }
            };
            return err;
        }
    });
}
exports.getNFTsOneCollection = getNFTsOneCollection;
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
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'The NFT was successfully deleted',
                    type: constants_1.SuccessResponseTypes.nullType,
                    data: null
                }
            };
            return res;
        }
        catch (error) {
            console.log(error.message);
            const err = {
                code: constants_1.CODES.INTERNAL_ERROR.code,
                error: {
                    name: constants_1.CODES.INTERNAL_ERROR.name,
                    message: error.message
                }
            };
            return err;
        }
    });
}
exports.deleteNFT = deleteNFT;
