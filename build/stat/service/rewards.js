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
exports.getRewardEventsRangeErc721 = exports.getRewardEventsRangeErc20 = exports.get24hCountErc721 = exports.get24hCountErc20 = exports.getUserCountErc721Reward = exports.getUserCountErc20Reward = exports.getTotalCountErc721Reward = exports.getTotalCountErc20Reward = exports.getRewardEventsRange = exports.getDistribution = exports.get24hCount = exports.getUserCount = exports.getTotalCount = void 0;
const db_1 = __importDefault(require("../../config/db"));
const constants_1 = require("../../utils/constants");
function getTotalCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardsErc20Count = yield (0, db_1.default)('rewards_erc20')
                .count('reward_event_erc20.id as count')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .first()
                .where('rewards_erc20.company_id', getCompany.company_id);
            const rewardsErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .where('rewards_erc721.company_id', getCompany.company_id);
            const total = {
                erc20: +rewardsErc20Count.count,
                erc721: +rewardsErc721Count.count
            };
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards total count',
                    type: constants_1.SuccessResponseTypes.object,
                    data: total
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
function getUserCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardedUsersErc20Count = yield (0, db_1.default)('rewards_erc20')
                .distinct('reward_event_erc20.user_id as user_id')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .where('rewards_erc20.company_id', getCompany.company_id);
            const rewardedUsersErc721Count = yield (0, db_1.default)('rewards_erc721')
                .distinct('reward_event_erc721.user_id as user_id')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .where('rewards_erc721.company_id', getCompany.company_id);
            const uniqueUserIds = new Set([...rewardedUsersErc20Count, ...rewardedUsersErc721Count].filter(user => user.user_id).map((user) => user.user_id));
            const totalUniqueUsers = uniqueUserIds.size;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards users count',
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
exports.getUserCount = getUserCount;
function get24hCount(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const rewarded24hErc20Count = yield (0, db_1.default)('rewards_erc20')
                .count('reward_event_erc20.id as count')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .first()
                .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo]);
            const rewarded24hErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards 24h',
                    type: constants_1.SuccessResponseTypes.number,
                    data: +rewarded24hErc20Count.count + +rewarded24hErc721Count.count
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
function getDistribution(getCompany) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardsErc20Distribution = yield (0, db_1.default)('rewards_erc20')
                .select('rewards_erc20.id', 'rewards_erc20.company_id', 'rewards_erc20.name')
                .count('reward_event_erc20.id as event_count')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .groupBy('rewards_erc20.id', 'rewards_erc20.company_id', 'rewards_erc20.name')
                .where('rewards_erc20.company_id', getCompany.company_id);
            const rewardsErc721Distribution = yield (0, db_1.default)('rewards_erc721')
                .select('rewards_erc721.id', 'rewards_erc721.company_id', 'rewards_erc721.name')
                .count('reward_event_erc721.id as event_count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .groupBy('rewards_erc721.id', 'rewards_erc721.company_id', 'rewards_erc721.name')
                .where('rewards_erc721.company_id', getCompany.company_id);
            const totalDistribution = [...rewardsErc20Distribution, ...rewardsErc721Distribution];
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards distribution',
                    type: constants_1.SuccessResponseTypes.array,
                    data: totalDistribution
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
exports.getDistribution = getDistribution;
function getRewardEventsRange(getCompany, dateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const intervals = 30;
            const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);
            const query = yield db_1.default.raw(`
            WITH all_events AS (
                (SELECT id, event_datetime FROM reward_event_erc20
                WHERE event_datetime >= ? AND event_datetime <= ? AND reward_id IN (
                    SELECT id FROM rewards_erc20 WHERE company_id = ?
                ))
                UNION
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
        `, [dateRange.startDate, dateRange.endDate, getCompany.company_id, dateRange.startDate, dateRange.endDate, getCompany.company_id, dateRange.startDate, dateRange.endDate, `${intervalSize} milliseconds`]);
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
exports.getRewardEventsRange = getRewardEventsRange;
//FOR ONE
function getTotalCountErc20Reward(getCompany, rewardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardsErc20Count = yield (0, db_1.default)('rewards_erc20')
                .count('reward_event_erc20.id as count')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .first()
                .whereRaw('rewards_erc20.company_id = ? AND rewards_erc20.id = ?', [getCompany.company_id, rewardId]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards total count for ERC20 reward',
                    type: constants_1.SuccessResponseTypes.object,
                    data: rewardsErc20Count.count
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
exports.getTotalCountErc20Reward = getTotalCountErc20Reward;
function getTotalCountErc721Reward(getCompany, rewardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardsErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .whereRaw('rewards_erc721.company_id = ? AND rewards_erc721.id = ?', [getCompany.company_id, rewardId]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards total count for ERC721 reward',
                    type: constants_1.SuccessResponseTypes.object,
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
exports.getTotalCountErc721Reward = getTotalCountErc721Reward;
function getUserCountErc20Reward(getCompany, rewardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardedUsersErc20Count = yield (0, db_1.default)('rewards_erc20')
                .first()
                .countDistinct('reward_event_erc20.user_id as count')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .whereRaw('rewards_erc20.company_id = ? AND rewards_erc20.id = ?', [getCompany.company_id, rewardId]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards users count for ERC20 reward',
                    type: constants_1.SuccessResponseTypes.number,
                    data: rewardedUsersErc20Count.count
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
exports.getUserCountErc20Reward = getUserCountErc20Reward;
function getUserCountErc721Reward(getCompany, rewardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rewardedUsersErc721Count = yield (0, db_1.default)('rewards_erc721')
                .first()
                .countDistinct('reward_event_erc721.user_id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .whereRaw('rewards_erc721.company_id = ? AND rewards_erc721.id = ?', [getCompany.company_id, rewardId]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards users count for ERC721 reward',
                    type: constants_1.SuccessResponseTypes.number,
                    data: rewardedUsersErc721Count.count
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
exports.getUserCountErc721Reward = getUserCountErc721Reward;
function get24hCountErc20(getCompany, rewardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const rewarded24hErc20Count = yield (0, db_1.default)('rewards_erc20')
                .count('reward_event_erc20.id as count')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
                .first()
                .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ? AND rewards_erc20.id = ?', [getCompany.company_id, twentyFourHoursAgo, rewardId]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards 24h for ERC20 reward',
                    type: constants_1.SuccessResponseTypes.number,
                    data: rewarded24hErc20Count.count
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
exports.get24hCountErc20 = get24hCountErc20;
function get24hCountErc721(getCompany, rewardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const rewarded24hErc721Count = yield (0, db_1.default)('rewards_erc721')
                .count('reward_event_erc721.id as count')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
                .first()
                .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ? AND rewards_erc721.id = ?', [getCompany.company_id, twentyFourHoursAgo, rewardId]);
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Rewards 24h for ERC721 reward',
                    type: constants_1.SuccessResponseTypes.number,
                    data: rewarded24hErc721Count.count
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
exports.get24hCountErc721 = get24hCountErc721;
function getRewardEventsRangeErc20(getCompany, uuidDateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const intervals = 30;
            const intervalSize = Math.floor((uuidDateRange.endDate.getTime() - uuidDateRange.startDate.getTime()) / intervals);
            const query = yield db_1.default.raw(`
            WITH all_events AS (
                (SELECT id, event_datetime FROM reward_event_erc20
                WHERE event_datetime >= ? AND event_datetime <= ? AND reward_id IN (
                    SELECT id FROM rewards_erc20 WHERE company_id = ? AND id = ?
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
        `, [uuidDateRange.startDate, uuidDateRange.endDate, getCompany.company_id, uuidDateRange.id, uuidDateRange.startDate, uuidDateRange.endDate, `${intervalSize} milliseconds`]);
            const result = query.rows;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Reward events range ERC20',
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
exports.getRewardEventsRangeErc20 = getRewardEventsRangeErc20;
function getRewardEventsRangeErc721(getCompany, uuidDateRange) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const intervals = 30;
            const intervalSize = Math.floor((uuidDateRange.endDate.getTime() - uuidDateRange.startDate.getTime()) / intervals);
            const query = yield db_1.default.raw(`
            WITH all_events AS (
                (SELECT id, event_datetime FROM reward_event_erc721
                WHERE event_datetime >= ? AND event_datetime <= ? AND reward_id IN (
                    SELECT id FROM rewards_erc721 WHERE company_id = ? AND id = ?
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
        `, [uuidDateRange.startDate, uuidDateRange.endDate, getCompany.company_id, uuidDateRange.id, uuidDateRange.startDate, uuidDateRange.endDate, `${intervalSize} milliseconds`]);
            const result = query.rows;
            const res = {
                code: constants_1.CODES.OK.code,
                body: {
                    message: 'Reward events range ERC721',
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
exports.getRewardEventsRangeErc721 = getRewardEventsRangeErc721;
