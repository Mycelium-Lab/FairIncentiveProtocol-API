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
exports.deleteApiKey = exports.createApiKey = exports.getApiKeys = void 0;
const db_1 = __importDefault(require("../config/db"));
const errors_1 = require("../errors");
const constants_1 = require("../utils/constants");
function getApiKeys(company) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keys = yield (0, db_1.default)('api_keys').select('*').where({ company_id: company.company_id });
            return {
                code: constants_1.CODES.OK.code,
                body: {
                    type: constants_1.SuccessResponseTypes.array,
                    data: keys,
                    message: "Api keys"
                }
            };
        }
        catch (error) {
            console.log(error.message);
            const prettyError = (0, errors_1.prettyApiKeysError)(error.message);
            return prettyError;
        }
    });
}
exports.getApiKeys = getApiKeys;
function createApiKey(company, key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('api_keys').insert({ company_id: company.company_id, key });
            return {
                code: constants_1.CODES.OK.code,
                body: {
                    type: constants_1.SuccessResponseTypes.string,
                    data: key,
                    message: "Api key was successfully created"
                }
            };
        }
        catch (error) {
            console.log(error.message);
            const prettyError = (0, errors_1.prettyApiKeysError)(error.message);
            return prettyError;
        }
    });
}
exports.createApiKey = createApiKey;
function deleteApiKey(company, key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.raw('DELETE FROM api_keys WHERE company_id=? AND key=?', [company.company_id, key]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Api key was successfully deleted',
                    type: constants_1.SuccessResponseTypes.nullType,
                    data: null
                }
            };
            return res;
        }
        catch (error) {
            console.log(error.message);
            const prettyError = (0, errors_1.prettyApiKeysError)(error.message);
            return prettyError;
        }
    });
}
exports.deleteApiKey = deleteApiKey;
