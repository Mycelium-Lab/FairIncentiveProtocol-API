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
exports.getTokensDistRange = exports.getCount24h = exports.getTotalCount = void 0;
const ethers_1 = require("ethers");
const db_1 = __importDefault(require("../../config/db"));
const constants_1 = require("../../utils/constants");
function getTotalCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const total = yield (0, db_1.default)('reward_event_erc20')
                .sum('rewards_erc20.amount as total')
                .innerJoin('rewards_erc20', 'reward_event_erc20.reward_id', 'rewards_erc20.id')
                .whereRaw('rewards_erc20.company_id = ?', [getCompany.company_id])
                .first();
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards total count',
                    type: constants_1.SuccessResponseTypes.number,
                    data: ethers_1.ethers.utils.formatEther(total.total || '0')
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
function getCount24h(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const total = yield (0, db_1.default)('reward_event_erc20')
                .sum('rewards_erc20.amount as total')
                .innerJoin('rewards_erc20', 'reward_event_erc20.reward_id', 'rewards_erc20.id')
                .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo])
                .first();
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards total count',
                    type: constants_1.SuccessResponseTypes.number,
                    data: ethers_1.ethers.utils.formatEther(total.total || '0')
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
exports.getCount24h = getCount24h;
function getTokensDistRange(getCompany, dateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const intervals = 30;
            const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);
            const query = yield db_1.default.raw(`
            WITH date_intervals AS (
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
            )
            SELECT
                date_interval_start,
                date_interval_end,
                COALESCE(SUM(CASE WHEN r.company_id = ? THEN r.amount ELSE 0 END), 0) as count
            FROM date_intervals
            LEFT JOIN reward_event_erc20 AS e ON e.event_datetime >= date_intervals.date_interval_start AND e.event_datetime < date_intervals.date_interval_end
            LEFT JOIN rewards_erc20 AS r ON e.reward_id = r.id
            GROUP BY date_interval_start, date_interval_end
            ORDER BY date_interval_start
        `, [dateRange.startDate, dateRange.endDate, `${intervalSize} milliseconds`, getCompany.company_id]);
            const result = query.rows;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Tokens dist range',
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
exports.getTokensDistRange = getTokensDistRange;
