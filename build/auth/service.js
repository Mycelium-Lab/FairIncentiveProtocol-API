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
exports.checkCompany = void 0;
const db_1 = __importDefault(require("../config/db"));
const constants_1 = require("../utils/constants");
const hash_1 = require("../utils/hash");
function checkCompany(company) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!company.email && !company.phone)
                throw Error('Either email or phone number must be filled in');
            const selectedCompany = yield db_1.default
                .select('*')
                //if user choose email for signin in or phone
                .where(company.email ? { email: company.email } : { phone: company.phone })
                .first()
                .from('companies');
            if (selectedCompany == undefined)
                throw Error('Not exist');
            const checkedPassword = yield (0, hash_1.compare)(company.password, selectedCompany.password);
            if (!checkedPassword)
                throw Error('Wrong password');
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Password is ok',
                    type: constants_1.SuccessResponseTypes.nullType,
                    data: {
                        company_id: selectedCompany.id,
                        address: selectedCompany.wallet
                    }
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
exports.checkCompany = checkCompany;
