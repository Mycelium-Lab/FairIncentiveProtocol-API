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
exports.getTotalCount = void 0;
const db_1 = __importDefault(require("../../config/db"));
const constants_1 = require("../../utils/constants");
function getTotalCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardsErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .where('rewards_erc721.company_id', getCompany.company_id);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards total count',
                    type: constants_1.SuccessResponseTypes.number,
                    data: rewardsErc721Count.count
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
exports.getTotalCount = getTotalCount;
