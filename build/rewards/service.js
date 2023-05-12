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
exports.getRewardTokenEvents = exports.rewardWithToken = exports.deleteTokenReward = exports.getTokenRewards = exports.addTokenReward = void 0;
const db_1 = __importDefault(require("../config/db"));
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
            console.log(tokenRewards);
            return tokenRewards;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getTokenRewards = getTokenRewards;
function deleteTokenReward(getCompany, deleteReward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('rewards_erc20').where({ id: deleteReward.id, company_id: getCompany.company_id }).delete();
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
            const rewardEvents = yield (0, db_1.default)('rewards_erc20')
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
            return rewardEvents;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getRewardTokenEvents = getRewardTokenEvents;
