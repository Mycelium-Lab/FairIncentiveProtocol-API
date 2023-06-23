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
const constants_1 = require("../utils/constants");
function addUser(user, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Using a transaction, because we want to add properties and statistics that 
            //relate to this user because we don't want to lose anything
            const trx = yield db_1.default.transaction();
            const _user = yield trx('users')
                .insert({
                company_id: getCompany.company_id,
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet,
                notes: user.notes
            }, '*')
                .then((_user) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                (_a = user.properties) === null || _a === void 0 ? void 0 : _a.forEach(v => {
                    v.user_id = _user[0].id;
                    v.company_id = getCompany.company_id;
                });
                (_b = user.stats) === null || _b === void 0 ? void 0 : _b.forEach(v => {
                    v.user_id = _user[0].id;
                    v.company_id = getCompany.company_id;
                });
                if ((_c = user.properties) === null || _c === void 0 ? void 0 : _c.length)
                    yield trx('user_properties').insert(user.properties);
                if ((_d = user.stats) === null || _d === void 0 ? void 0 : _d.length)
                    yield trx('user_stats').insert(user.stats);
                return _user[0];
            }))
                .then((_user) => __awaiter(this, void 0, void 0, function* () {
                yield trx.commit();
                return _user;
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                yield trx.rollback();
                return err.message;
            }));
            //If there is no error
            if (!(_user instanceof String)) {
                const res = {
                    code: constants_1.CODES.OK.code,
                    body: {
                        message: 'The user was successfully added',
                        type: constants_1.SuccessResponseTypes.object,
                        data: _user
                    }
                };
                return res;
            }
            else {
                const err = {
                    code: constants_1.CODES.INTERNAL_ERROR.code,
                    error: {
                        name: constants_1.CODES.INTERNAL_ERROR.name,
                        message: _user.toString()
                    }
                };
                return err;
            }
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
exports.addUser = addUser;
function getUsers(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield (0, db_1.default)('users')
                .select([
                'users.id as id', 'users.company_id as company_id',
                'users.external_id as external_id', 'users.email as email',
                'users.wallet as wallet', 'users.image as image', 'users.notes as notes',
                db_1.default.raw(`
                    ARRAY(
                        SELECT JSON_BUILD_OBJECT('name', user_properties.name, 'value', user_properties.value)
                        FROM user_properties
                        WHERE user_properties.user_id = users.id
                        AND user_properties.name IS NOT NULL
                    ) as properties
                `),
                db_1.default.raw(`
                    ARRAY(
                        SELECT JSON_BUILD_OBJECT('name', user_stats.name, 'value', user_stats.value)
                        FROM user_stats
                        WHERE user_stats.user_id = users.id
                        AND user_stats.name IS NOT NULL
                    ) as stats
                `),
                db_1.default.raw(`
                    ARRAY (
                        SELECT JSON_BUILD_OBJECT(
                            'reward_name', rewards_erc721.name,
                            'nft_name', nfts.name,
                            'collection_name', erc721_tokens.name,
                            'count', COUNT(*)
                        )
                        FROM reward_event_erc721
                        LEFT JOIN rewards_erc721 ON rewards_erc721.id = reward_event_erc721.reward_id
                        LEFT JOIN nfts ON nfts.id = rewards_erc721.nft_id
                        LEFT JOIN erc721_tokens ON erc721_tokens.address = nfts.address
                        WHERE reward_event_erc721.user_id = users.id
                        GROUP BY rewards_erc721.name, nfts.name, erc721_tokens.name
                    ) as nft_rewards
                `),
                db_1.default.raw(`
                    ARRAY (
                        SELECT JSON_BUILD_OBJECT(
                            'token_name', erc20_tokens.name,
                            'reward_name', rewards_erc20.name,
                            'count', COUNT(*)
                        )
                        FROM reward_event_erc20
                        LEFT JOIN rewards_erc20 ON rewards_erc20.id = reward_event_erc20.reward_id
                        LEFT JOIN erc20_tokens ON erc20_tokens.address = rewards_erc20.address
                        WHERE reward_event_erc20.user_id = users.id
                        GROUP BY erc20_tokens.name, rewards_erc20.name
                    ) as token_rewards
                `)
            ])
                .leftJoin('user_properties', 'users.id', '=', 'user_properties.user_id')
                .leftJoin('user_stats', 'users.id', '=', 'user_stats.user_id')
                .whereRaw('users.company_id = ?', [getCompany.company_id])
                .groupBy([
                'users.id', 'users.company_id', 'users.external_id', 'users.email', 'users.wallet', 'users.image', 'users.notes'
            ]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Users',
                    type: constants_1.SuccessResponseTypes.array,
                    data: users
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
exports.getUsers = getUsers;
function deleteUser(deleteUser, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.default.raw('DELETE FROM users WHERE company_id=? AND id=?', [getCompany.company_id, deleteUser.id]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'The user was successfully deleted',
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
exports.deleteUser = deleteUser;
function updateUser(user, getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)('user_properties').where({ user_id: user.id, company_id: getCompany.company_id }).delete();
            yield (0, db_1.default)('user_stats').where({ user_id: user.id, company_id: getCompany.company_id }).delete();
            const trx = yield db_1.default.transaction();
            const updating = yield trx('users')
                .where({ id: user.id, company_id: getCompany.company_id })
                .update({
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet,
                notes: user.notes
            })
                .then(() => __awaiter(this, void 0, void 0, function* () {
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
            }))
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield trx.commit();
                return 'ok';
            }))
                .catch((err) => __awaiter(this, void 0, void 0, function* () {
                yield trx.rollback();
                return err.message;
            }));
            if (updating === 'ok') {
                const res = {
                    code: constants_1.CODES.OK.code,
                    body: {
                        message: 'User has been successfully updated',
                        type: constants_1.SuccessResponseTypes.nullType,
                        data: null
                    }
                };
                return res;
            }
            else {
                const err = {
                    code: constants_1.CODES.INTERNAL_ERROR.code,
                    error: {
                        name: constants_1.CODES.INTERNAL_ERROR.name,
                        message: updating
                    }
                };
                return err;
            }
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
exports.updateUser = updateUser;
