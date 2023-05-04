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
exports.checkCompany = exports.createCompany = void 0;
const db_1 = __importDefault(require("../config/db"));
const errors_1 = require("../errors");
const hash_1 = require("../utils/hash");
function createCompany(company) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield (0, hash_1.hash)(company.password);
            if (hashedPassword) {
                company.password = hashedPassword;
            }
            else {
                throw Error('Something wrong with hashed password');
            }
            yield (0, db_1.default)('companies')
                .insert({
                name: company.name,
                email: company.email,
                password: company.password,
                wallet: company.wallet,
                phone: company.phone
            });
            return {
                isError: false,
                code: 200,
                res: {
                    message: "Company added to database"
                }
            };
        }
        catch (error) {
            console.log(error);
            const prettyError = (0, errors_1.prettyAuthError)(error.message);
            return {
                isError: true,
                code: prettyError.code,
                res: {
                    message: prettyError.message
                }
            };
        }
    });
}
exports.createCompany = createCompany;
function checkCompany(company) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!company.email && !company.phone)
                throw Error('Either email or phone number must be filled in');
            const selectedCompany = yield db_1.default
                .select('*')
                //if user choose email for signin in or phone
                .where(company.email ? { email: company.email } : { phone: company.phone })
                .from('companies');
            if (selectedCompany.length === 0)
                throw Error('Not exist');
            const checkedPassword = yield (0, hash_1.compare)(company.password, selectedCompany[0].password);
            if (!checkedPassword)
                throw Error('Wrong password');
            return {
                isError: false,
                code: 200,
                res: {
                    message: "OK"
                }
            };
        }
        catch (error) {
            const prettyError = (0, errors_1.prettyAuthError)(error.message);
            return {
                isError: true,
                code: prettyError.code,
                res: {
                    message: prettyError.message
                }
            };
        }
    });
}
exports.checkCompany = checkCompany;
