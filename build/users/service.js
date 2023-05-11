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
exports.deleteUser = exports.getUsers = exports.addUser = void 0;
const db_1 = __importDefault(require("../config/db"));
function addUser(user, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const trx = yield db_1.default.transaction();
            const id = yield trx('users')
                .insert({
                company_id: getCompany.company_id,
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet
            }, 'id')
                .then((ids) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                (_a = user.properties) === null || _a === void 0 ? void 0 : _a.forEach(v => {
                    v.user_id = ids[0].id;
                    v.company_id = getCompany.company_id;
                });
                (_b = user.stats) === null || _b === void 0 ? void 0 : _b.forEach(v => {
                    v.user_id = ids[0].id;
                    v.company_id = getCompany.company_id;
                });
                yield trx('user_properties').insert(user.properties);
                yield trx('user_stats').insert(user.stats);
                return ids[0].id;
            }))
                .then((id) => __awaiter(this, void 0, void 0, function* () {
                yield trx.commit();
                return id;
            }))
                .catch((err) => {
                console.log(err);
                trx.rollback;
                return null;
            });
            return id;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.addUser = addUser;
function getUsers(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield db_1.default
                .select('*')
                .where({
                company_id: getCompany.company_id
            })
                .from('users');
            return users;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
exports.getUsers = getUsers;
function deleteUser(deleteUser, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('users').where({ company_id: getCompany.company_id, id: deleteUser.id }).delete();
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.deleteUser = deleteUser;
