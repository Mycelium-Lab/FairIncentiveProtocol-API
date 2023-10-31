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
exports.getTotalUsersRange = exports.getNewUsersRange = exports.getActive = exports.get24hCount = exports.getTotalCount = void 0;
const db_1 = __importDefault(require("../../config/db"));
const constants_1 = require("../../utils/constants");
function getTotalCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const total = yield (0, db_1.default)('users')
                .count('id as count')
                .first()
                .where('company_id', getCompany.company_id);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Users total count',
                    type: constants_1.SuccessResponseTypes.number,
                    data: total.count
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
function get24hCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const usersAdded24hAgo = yield (0, db_1.default)('users')
                .count('id as count')
                .first()
                .whereRaw('company_id = ? AND add_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Users 24h count',
                    type: constants_1.SuccessResponseTypes.number,
                    data: usersAdded24hAgo.count
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
exports.get24hCount = get24hCount;
function getActive(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
            const rewarded60daysErc20Count = yield (0, db_1.default)('rewards_erc20')
                .distinct('reward_event_erc20.user_id')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ?', [getCompany.company_id, sixtyDaysAgo]);
            const rewarded60daysErc721Count = yield (0, db_1.default)('rewards_erc721')
                .distinct('reward_event_erc721.user_id ')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ?', [getCompany.company_id, sixtyDaysAgo]);
            const uniqueUserIds = new Set([...rewarded60daysErc20Count, ...rewarded60daysErc721Count].map((user) => user.user_id));
            const totalUniqueUsers = uniqueUserIds.size;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Users 24h count',
                    type: constants_1.SuccessResponseTypes.number,
                    data: totalUniqueUsers
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
exports.getActive = getActive;
function getNewUsersRange(getCompany, dateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const intervals = 30;
            const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);
            const query = yield db_1.default.raw(`
            SELECT
            date_interval_start,
            date_interval_end,
            count("id") as count
            FROM (
            SELECT
                date_interval_start,
                date_interval_start + INTERVAL '${intervalSize} milliseconds' as date_interval_end
            FROM (
                SELECT
                generate_series(
                    ?::timestamp,
                    ?::timestamp,
                    ?::interval
                ) AS date_interval_start
            ) AS date_intervals
            ) AS intervals
            LEFT JOIN "users" ON
            "add_datetime" >= intervals.date_interval_start AND
            "add_datetime" < intervals.date_interval_end AND
            "company_id" = ?
            GROUP BY date_interval_start, date_interval_end
            ORDER BY date_interval_start;
        `, [dateRange.startDate, dateRange.endDate, `${intervalSize} milliseconds`, getCompany.company_id]);
            const result = query.rows;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'New users range',
                    type: constants_1.SuccessResponseTypes.array,
                    data: result
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
exports.getNewUsersRange = getNewUsersRange;
function getTotalUsersRange(getCompany, dateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const intervals = 30;
            const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);
            let dates = [];
            for (let i = 0; i <= intervals; i++) {
                dates.push(new Date(new Date(i === 0 ? dateRange.startDate.toISOString() : dates[i - 1]).getTime() + intervalSize).toISOString());
            }
            dates = dates.map((v) => `'${v}'`);
            const query = yield db_1.default.raw(`
            SELECT
            end_date,
            COUNT(id) AS count
            FROM (
            SELECT
                unnest(ARRAY[${dates.join(', ')}]::timestamptz[]) AS end_date
            ) AS end_dates
            LEFT JOIN users ON add_datetime <= end_date AND company_id = ?
            GROUP BY end_date
            ORDER BY end_date;
        `, [getCompany.company_id]);
            const result = query.rows;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Total users range',
                    type: constants_1.SuccessResponseTypes.array,
                    data: result
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
exports.getTotalUsersRange = getTotalUsersRange;
