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
exports.updateUser = exports.deleteUser = exports.getUsers = exports.addUser = void 0;
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
                wallet: user.wallet,
                notes: user.notes
            }, 'id')
                .then((ids) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                (_a = user.properties) === null || _a === void 0 ? void 0 : _a.forEach(v => {
                    v.user_id = ids[0].id;
                    v.company_id = getCompany.company_id;
                });
                (_b = user.stats) === null || _b === void 0 ? void 0 : _b.forEach(v => {
                    v.user_id = ids[0].id;
                    v.company_id = getCompany.company_id;
                });
                if ((_c = user.properties) === null || _c === void 0 ? void 0 : _c.length)
                    yield trx('user_properties').insert(user.properties);
                if ((_d = user.stats) === null || _d === void 0 ? void 0 : _d.length)
                    yield trx('user_stats').insert(user.stats);
                return ids[0].id;
            }))
                .then((id) => __awaiter(this, void 0, void 0, function* () {
                yield trx.commit();
                return id;
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                console.log(err);
                yield trx.rollback();
                return null;
            }));
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
            const users = yield (0, db_1.default)('users')
                .select([
                'users.id as id', 'users.company_id as company_id',
                'users.external_id as external_id', 'users.email as email',
                'users.wallet as wallet', 'users.image as image', 'users.notes as notes',
                db_1.default.raw('JSON_AGG(JSON_BUILD_OBJECT(\'name\', user_properties.name, \'value\', user_properties.value)) as properties'),
                db_1.default.raw('JSON_AGG(JSON_BUILD_OBJECT(\'name\', user_stats.name, \'value\', user_stats.value)) as stats')
            ])
                .leftJoin('user_properties', 'users.id', '=', 'user_properties.user_id')
                .leftJoin('user_stats', 'users.id', '=', 'user_stats.user_id')
                .whereRaw('users.company_id = ?', [getCompany.company_id])
                .groupBy('users.id', 'users.company_id', 'users.external_id', 'users.email', 'users.wallet', 'users.image', 'users.notes');
            const formattedUsers = users.map(user => {
                var _a, _b;
                const uniquePropertiesMap = new Map(); // Map для отслеживания уникальных свойств
                user.properties = (_a = user.properties) === null || _a === void 0 ? void 0 : _a.filter(property => {
                    if (property.name !== null && !uniquePropertiesMap.has(property.name)) {
                        uniquePropertiesMap.set(property.name, true);
                        return true;
                    }
                    return false;
                });
                const uniqueStatsMap = new Map(); // Map для отслеживания уникальных свойств
                user.stats = (_b = user.stats) === null || _b === void 0 ? void 0 : _b.filter(stat => {
                    if (stat.name !== null && !uniqueStatsMap.has(stat.name)) {
                        uniqueStatsMap.set(stat.name, true);
                        return true;
                    }
                    return false;
                });
                return user;
            });
            return formattedUsers;
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
            yield db_1.default.raw('DELETE FROM users WHERE company_id=? AND id=?', [getCompany.company_id, deleteUser.id]);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.deleteUser = deleteUser;
function updateUser(user, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('user_properties').where({ user_id: user.id, company_id: getCompany.company_id }).delete();
            yield (0, db_1.default)('user_stats').where({ user_id: user.id, company_id: getCompany.company_id }).delete();
            const trx = yield db_1.default.transaction();
            const ok = yield trx('users')
                .where({ id: user.id })
                .update({
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet,
                notes: user.notes
            })
                .then((ids) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                (_a = user.properties) === null || _a === void 0 ? void 0 : _a.forEach(v => {
                    v.user_id = user.id;
                    v.company_id = getCompany.company_id;
                });
                (_b = user.stats) === null || _b === void 0 ? void 0 : _b.forEach(v => {
                    v.user_id = user.id;
                    v.company_id = getCompany.company_id;
                });
                if ((_c = user.properties) === null || _c === void 0 ? void 0 : _c.length)
                    yield trx('user_properties').insert(user.properties);
                if ((_d = user.stats) === null || _d === void 0 ? void 0 : _d.length)
                    yield trx('user_stats').insert(user.stats);
                return true;
            }))
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield trx.commit();
                return true;
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                console.log(err);
                yield trx.rollback();
                return false;
            }));
            return ok;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
exports.updateUser = updateUser;
