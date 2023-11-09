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
exports.getNftsDistRange = exports.get24hCount = exports.getTotalCount = void 0;
const db_1 = __importDefault(require("../../config/db"));
const constants_1 = require("../../utils/constants");
function getTotalCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardsErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .where('rewards_erc721.company_id', getCompany.company_id);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards total count',
                    type: constants_1.SuccessResponseTypes.number,
                    data: rewardsErc721Count.count
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
            const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
            const rewarded24hErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo]);
            const rewarded48hErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ? AND reward_event_erc721.event_datetime <= ?', [getCompany.company_id, fortyEightHoursAgo, twentyFourHoursAgo]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards 24h',
                    type: constants_1.SuccessResponseTypes.number,
                    data: {
                        twentyFourHoursAgo: rewarded24hErc721Count.count,
                        fortyEightHoursAgo: rewarded48hErc721Count.count
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
exports.get24hCount = get24hCount;
function getNftsDistRange(getCompany, dateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const intervals = 30;
            const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);
            const query = yield db_1.default.raw(`
            WITH all_events AS (
                (SELECT id, event_datetime FROM reward_event_erc721
                WHERE event_datetime >= ? AND event_datetime <= ? AND reward_id IN (
                    SELECT id FROM rewards_erc721 WHERE company_id = ?
                ))
            )
            SELECT
                date_interval_start,
                date_interval_end,
                COUNT(id) as count
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
            LEFT JOIN all_events ON all_events.event_datetime >= intervals.date_interval_start AND all_events.event_datetime < intervals.date_interval_end
            GROUP BY date_interval_start, date_interval_end
            ORDER BY date_interval_start;
        `, [dateRange.startDate, dateRange.endDate, getCompany.company_id, dateRange.startDate, dateRange.endDate, `${intervalSize} milliseconds`]);
            const result = query.rows;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Nfts dist range',
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
exports.getNftsDistRange = getNftsDistRange;
