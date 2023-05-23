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
exports.deleteNFTRewardEvent = exports.deleteTokenRewardEvent = exports.updateNFTReward = exports.updateTokenReward = exports.getClaimableNFT = exports.getRewardNFTEvents = exports.rewardWithNFT = exports.deleteNFTReward = exports.getNFTRewards = exports.addNFTReward = exports.getRewardTokenEvents = exports.rewardWithToken = exports.deleteTokenReward = exports.getTokenRewards = exports.addTokenReward = void 0;
const ethers_1 = require("ethers");
const db_1 = __importDefault(require("../config/db"));
const config_1 = require("../config/config");
const sign_1 = require("../utils/sign");
function addTokenReward(getCompany, tokenReward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tokenReward.company_id = getCompany.company_id;
            const addedReward = yield (0, db_1.default)('rewards_erc20').insert(tokenReward).returning('*');
            const token = yield (0, db_1.default)('erc20_tokens').select('*').where({ address: tokenReward.address }).first();
            addedReward[0].symbol = token.symbol;
            return addedReward[0];
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    });
}
exports.addTokenReward = addTokenReward;
function getTokenRewards(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenRewards = yield (0, db_1.default)('rewards_erc20')
                .count('reward_event_erc20.user_id')
                .whereRaw('rewards_erc20.company_id = ?', [getCompany.company_id])
                .leftJoin('erc20_tokens', 'rewards_erc20.address', '=', 'erc20_tokens.address')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', '=', 'reward_event_erc20.reward_id')
                .groupBy('rewards_erc20.id', 'rewards_erc20.name', 'rewards_erc20.description', 'rewards_erc20.amount', 'rewards_erc20.address', 'erc20_tokens.symbol')
                .select(['rewards_erc20.id', 'rewards_erc20.name', 'rewards_erc20.description', 'rewards_erc20.amount', 'rewards_erc20.address', 'erc20_tokens.symbol']);
            return tokenRewards;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getTokenRewards = getTokenRewards;
function deleteTokenReward(getCompany, Delete) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('rewards_erc20').where({ id: Delete.id, company_id: getCompany.company_id }).delete();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.deleteTokenReward = deleteTokenReward;
function rewardWithToken(getCompany, reward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenReward = yield (0, db_1.default)('rewards_erc20').select('*').where({ id: reward.reward_id }).first();
            if (tokenReward.company_id !== getCompany.company_id)
                throw Error('Not allowed company');
            yield (0, db_1.default)('reward_event_erc20').insert({
                status: 1,
                reward_id: reward.reward_id,
                user_id: reward.user_id,
                comment: reward.comment
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.rewardWithToken = rewardWithToken;
function getRewardTokenEvents(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let rewardEvents = yield (0, db_1.default)('rewards_erc20')
                .whereRaw('rewards_erc20.company_id = ?', [getCompany.company_id])
                .leftJoin('reward_event_erc20', 'reward_event_erc20.reward_id', '=', 'rewards_erc20.id')
                .leftJoin('users', 'users.id', '=', 'reward_event_erc20.user_id')
                .leftJoin('erc20_tokens', 'erc20_tokens.address', '=', 'rewards_erc20.address')
                .leftJoin('reward_event_statuses', 'reward_event_statuses.id', '=', 'reward_event_erc20.status')
                .select([
                'rewards_erc20.id as reward_id', 'rewards_erc20.name as reward_name',
                'users.id as user_id', 'users.external_id as user_external_id',
                'reward_event_erc20.id as event_id', 'reward_event_statuses.status as status',
                'rewards_erc20.address as token_address', 'erc20_tokens.symbol as token_symbol',
                'rewards_erc20.amount as token_amount', 'reward_event_erc20.comment as event_comment'
            ]);
            rewardEvents = rewardEvents.filter(v => v.user_id !== null);
            return rewardEvents;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getRewardTokenEvents = getRewardTokenEvents;
function addNFTReward(getCompany, nftReward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            nftReward.company_id = getCompany.company_id;
            const company = yield (0, db_1.default)('nfts')
                .whereRaw('nfts.id = ?', [nftReward.nft_id])
                .leftJoin('erc721_tokens', 'nfts.address', '=', 'erc721_tokens.address')
                .select('erc721_tokens.company_id as company_id')
                .first();
            if (!company.company_id)
                throw Error('Not this company');
            const addedReward = yield (0, db_1.default)('rewards_erc721').insert(nftReward).returning('*');
            const nftCollection = yield (0, db_1.default)('nfts')
                .whereRaw('nfts.id = ?', [addedReward[0].nft_id])
                .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
                .select(['erc721_tokens.symbol', 'nfts.name as nft_name'])
                .first();
            addedReward[0].symbol = nftCollection.symbol;
            addedReward[0].nft_name = nftCollection.nft_name;
            console.log(addedReward[0]);
            return addedReward[0];
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    });
}
exports.addNFTReward = addNFTReward;
function getNFTRewards(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nftRewards = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.user_id')
                .whereRaw('rewards_erc721.company_id = ?', [getCompany.company_id])
                .leftJoin('nfts', 'rewards_erc721.nft_id', '=', 'nfts.id')
                .leftJoin('erc721_tokens', 'nfts.address', '=', 'erc721_tokens.address')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', '=', 'reward_event_erc721.reward_id')
                .groupBy('rewards_erc721.id', 'rewards_erc721.name', 'rewards_erc721.description', 'rewards_erc721.nft_id', 'erc721_tokens.symbol', 'nfts.name', 'nfts.address')
                .select(['rewards_erc721.id', 'rewards_erc721.name', 'rewards_erc721.description', 'rewards_erc721.nft_id', 'erc721_tokens.symbol', 'nfts.name as nft_name', 'nfts.address as address']);
            return nftRewards;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getNFTRewards = getNFTRewards;
function deleteNFTReward(getCompany, Delete) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('rewards_erc721').where({ id: Delete.id, company_id: getCompany.company_id }).delete();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.deleteNFTReward = deleteNFTReward;
function rewardWithNFT(getCompany, reward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nftReward = yield (0, db_1.default)('rewards_erc721')
                .whereRaw('rewards_erc721.id = ?', [reward.reward_id])
                .first()
                .leftJoin('nfts', 'nfts.id', '=', 'rewards_erc721.nft_id')
                .select(['*', 'nfts.name as nft_name', 'nfts.id as nft_id', 'nfts.chainid as chainid']);
            if (nftReward.company_id !== getCompany.company_id)
                throw Error('Not allowed company');
            const network = config_1.config.networks.find(n => n.chainid == nftReward.chainid);
            const provider = new ethers_1.ethers.providers.JsonRpcProvider(network === null || network === void 0 ? void 0 : network.rpc);
            const signer = new ethers_1.ethers.Wallet((network === null || network === void 0 ? void 0 : network.private_key) || '', provider);
            const user = yield (0, db_1.default)('users').where({ id: reward.user_id }).first();
            const signature = yield (0, sign_1.signNFTReward)(nftReward.image ? nftReward.image : '', user.wallet, signer, nftReward.address ? nftReward.address : '');
            yield (0, db_1.default)('reward_event_erc721').insert({
                status: 1,
                reward_id: reward.reward_id,
                user_id: reward.user_id,
                comment: reward.comment,
                v: signature.v,
                r: signature.r,
                s: signature.s
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.rewardWithNFT = rewardWithNFT;
function getRewardNFTEvents(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let rewardEvents = yield (0, db_1.default)('rewards_erc721')
                .whereRaw('rewards_erc721.company_id = ?', [getCompany.company_id])
                .leftJoin('reward_event_erc721', 'reward_event_erc721.reward_id', '=', 'rewards_erc721.id')
                .leftJoin('users', 'users.id', '=', 'reward_event_erc721.user_id')
                .leftJoin('nfts', 'nfts.id', '=', 'rewards_erc721.nft_id')
                .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
                .leftJoin('reward_event_statuses', 'reward_event_statuses.id', '=', 'reward_event_erc721.status')
                .select([
                'rewards_erc721.id as reward_id', 'rewards_erc721.name as reward_name',
                'users.id as user_id', 'users.external_id as user_external_id',
                'reward_event_erc721.id as event_id', 'reward_event_statuses.status as status',
                'nfts.address as token_address', 'erc721_tokens.symbol as token_symbol',
                'reward_event_erc721.comment as event_comment', 'nfts.name as nft_name',
                'nfts.id as nft_id'
            ]);
            rewardEvents = rewardEvents.filter(v => v.user_id !== null);
            return rewardEvents;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getRewardNFTEvents = getRewardNFTEvents;
function getClaimableNFT(rewardEventID, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const claimableNFT = yield (0, db_1.default)('reward_event_erc721')
                .whereRaw('reward_event_erc721.id = ? AND reward_event_erc721.user_id = ?', [rewardEventID, user_id])
                .first()
                .leftJoin('rewards_erc721', 'rewards_erc721.id', '=', 'reward_event_erc721.reward_id')
                .leftJoin('nfts', 'nfts.id', '=', 'rewards_erc721.nft_id')
                .leftJoin('users', 'users.id', '=', 'reward_event_erc721.user_id')
                .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
                .select([
                'erc721_tokens.name as collection_name', 'erc721_tokens.address as collection_address',
                'nfts.name as nft_name', 'nfts.image as nft_image',
                'nfts.description as nft_description', 'nfts.chainid as chainid',
                'users.wallet as user_wallet',
                'reward_event_erc721.v as v', 'reward_event_erc721.s as s', 'reward_event_erc721.r as r',
                'erc721_tokens.beneficiary as beneficiary'
            ]);
            return claimableNFT;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.getClaimableNFT = getClaimableNFT;
function updateTokenReward(getCompany, tokenReward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardEvent = yield (0, db_1.default)('reward_event_erc20').count('id').where({ reward_id: tokenReward.id }).first();
            //if some reward event exist with this reward then can't update token
            if (rewardEvent.count != 0) {
                tokenReward.address = undefined;
            }
            yield (0, db_1.default)('rewards_erc20').update(tokenReward).where({ company_id: getCompany.company_id, id: tokenReward.id });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.updateTokenReward = updateTokenReward;
function updateNFTReward(getCompany, nftReward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //check if nft_id is in that collection
            const rewardEvent = yield (0, db_1.default)('reward_event_erc721').count('id').where({ reward_id: nftReward.id }).first();
            //if some reward event exist with this reward then can't update token
            if (rewardEvent.count != 0) {
                nftReward.nft_id = undefined;
            }
            yield (0, db_1.default)('rewards_erc721').update(nftReward).where({ company_id: getCompany.company_id, id: nftReward.id });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.updateNFTReward = updateNFTReward;
function deleteTokenRewardEvent(getCompany, deleteRewardEvent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardCompany = yield (0, db_1.default)('reward_event_erc20')
                .whereRaw('reward_event_erc20.id = ?', deleteRewardEvent.id)
                .leftJoin('rewards_erc20', 'rewards_erc20.id', '=', 'reward_event_erc20.reward_id')
                .first()
                .select(['rewards_erc20.company_id as id']);
            if (rewardCompany.id !== getCompany.company_id)
                throw Error('Not this company token reward');
            yield (0, db_1.default)('reward_event_erc20').whereRaw('id = ? AND status = 1', [deleteRewardEvent.id]).delete();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.deleteTokenRewardEvent = deleteTokenRewardEvent;
function deleteNFTRewardEvent(getCompany, deleteRewardEvent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardCompany = yield (0, db_1.default)('reward_event_erc721')
                .whereRaw('reward_event_erc721.id = ?', deleteRewardEvent.id)
                .leftJoin('rewards_erc721', 'rewards_erc721.id', '=', 'reward_event_erc721.reward_id')
                .first()
                .select(['rewards_erc721.company_id as id']);
            if (rewardCompany.id !== getCompany.company_id)
                throw Error('Not this company token reward');
            yield (0, db_1.default)('reward_event_erc721').whereRaw('id = ? AND status = 1', [deleteRewardEvent.id]).delete();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.deleteNFTRewardEvent = deleteNFTRewardEvent;
