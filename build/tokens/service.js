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
exports.getTokens = exports.addToken = void 0;
const db_1 = __importDefault(require("../config/db"));
const constants_1 = require("../utils/constants");
function addToken(token, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newToken = yield (0, db_1.default)('erc20_tokens')
                .insert({
                company_id: getCompany.company_id,
                name: token.name,
                symbol: token.symbol,
                supply_type: token.supply_type,
                chainid: token.chainid,
                address: token.address,
                max_supply: token.max_supply,
                initial_supply: token.initial_supply,
                pausable: token.pausable,
                burnable: token.burnable,
                blacklist: token.blacklist,
                recoverable: token.recoverable,
                verified: token.verified,
                fpmanager: token.fpmanager,
                image: token.image
            })
                .returning('*');
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'The token was successfully added',
                    type: constants_1.SuccessResponseTypes.object,
                    data: newToken[0]
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
exports.addToken = addToken;
function getTokens(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokens = yield (0, db_1.default)('erc20_tokens')
                .select('*')
                .where({
                company_id: getCompany.company_id
            });
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Tokens',
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
exports.getTokens = getTokens;
