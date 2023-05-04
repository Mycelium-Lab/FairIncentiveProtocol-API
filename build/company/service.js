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
exports.changePassword = exports.changeWallet = exports.changePhone = exports.changeEmail = exports.changeName = exports.getCompany = void 0;
const db_1 = __importDefault(require("../config/db"));
const hash_1 = require("../utils/hash");
function getCompany(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const selectedCompany = yield db_1.default
                .select(['name', 'email', 'wallet', 'id', 'phone', 'role_id'])
                //if user choose email for signin in or phone
                .where(getCompany.email ? { email: getCompany.email } : { phone: getCompany.phone })
                .from('companies')
                .first();
            return selectedCompany;
        }
        catch (error) {
            console.error(error);
            return { name: '', wallet: '' };
        }
    });
}
exports.getCompany = getCompany;
function changeName(company, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where(company.email ? { email: company.email } : { phone: company.phone })
                .update({
                name: newName
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.changeName = changeName;
function changeEmail(company, newEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where(company.email ? { email: company.email } : { phone: company.phone })
                .update({
                email: newEmail
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.changeEmail = changeEmail;
function changePhone(company, newPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where(company.email ? { email: company.email } : { phone: company.phone })
                .update({
                phone: newPhone
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.changePhone = changePhone;
function changeWallet(company, newWallet) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('companies')
                .where(company.email ? { email: company.email } : { phone: company.phone })
                .update({
                wallet: newWallet
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.changeWallet = changeWallet;
function changePassword(company, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield (0, hash_1.hash)(newPassword);
            yield (0, db_1.default)('companies')
                .where(company.email ? { email: company.email } : { phone: company.phone })
                .update({
                password: hashedPassword
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.changePassword = changePassword;
