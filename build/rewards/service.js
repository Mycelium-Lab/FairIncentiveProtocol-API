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
exports.deleteTokenReward = exports.getTokenRewards = exports.addTokenReward = void 0;
const db_1 = __importDefault(require("../config/db"));
function addTokenReward(getCompany, tokenReward) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tokenReward.company_id = getCompany.company_id;
            const addedReward = yield (0, db_1.default)('rewards_erc20').insert(tokenReward).returning('*');
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
                .select('*')
                .where({
                company_id: getCompany.company_id
            });
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
