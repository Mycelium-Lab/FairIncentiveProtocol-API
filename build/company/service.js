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
exports.changePassword = exports.changeWallet = exports.changePhone = exports.changeEmail = exports.changeName = exports.getCompany = exports.createCompany = void 0;
const db_1 = __importDefault(require("../config/db"));
const errors_1 = require("../errors");
const constants_1 = require("../utils/constants");
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
            const id = yield (0, db_1.default)('companies')
                .insert({
                name: company.name,
                email: company.email,
                password: company.password,
                wallet: company.wallet,
                phone: company.phone
            }, "id");
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'The company was successfully added',
                    type: constants_1.SuccessResponseTypes.string,
                    data: id[0].id
                }
            };
            return res;
        }
        catch (error) {
            console.log(error.message);
            const err = (0, errors_1.prettyCompanyError)(error.message);
            console.log(err);
            return err;
        }
    });
}
exports.createCompany = createCompany;
function getCompany(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const selectedCompany = yield db_1.default
                .select(['name', 'email', 'wallet', 'id', 'phone', 'role_id'])
                .where({ id: getCompany.company_id })
                .from('companies')
                .first();
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Users',
                    type: constants_1.SuccessResponseTypes.object,
                    data: selectedCompany
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
exports.getCompany = getCompany;
function changeName(company, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where({ id: company.company_id })
                .update({
                name: newName
            });
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Company name has been successfully updated',
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
exports.changeName = changeName;
function changeEmail(company, newEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where({ id: company.company_id })
                .update({
                email: newEmail
            });
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Company email has been successfully updated',
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
exports.changeEmail = changeEmail;
function changePhone(company, newPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where({ id: company.company_id })
                .update({
                phone: newPhone
            });
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Company phone has been successfully updated',
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
exports.changePhone = changePhone;
function changeWallet(company, newWallet) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where({ id: company.company_id })
                .update({
                wallet: newWallet
            });
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Company wallet has been successfully updated',
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
exports.changeWallet = changeWallet;
function changePassword(company, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield (0, hash_1.hash)(newPassword);
            yield (0, db_1.default)('companies')
                .where({ id: company.company_id })
                .update({
                password: hashedPassword
            });
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Company password has been successfully updated',
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
exports.changePassword = changePassword;
