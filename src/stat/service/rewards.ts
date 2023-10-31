import pg from "../../config/db"
import { DateInterval, DateRange, Distribution, ErrorResponse, GetCompany, SuccessResponse, Total, TotalOneType } from "../../entities"
import { CODES, SuccessResponseTypes } from "../../utils/constants"

export async function getTotalCount(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const rewardsErc20Count: TotalOneType = await pg('rewards_erc20')
            .count('reward_event_erc20.id as count')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .first()
            .where('rewards_erc20.company_id', getCompany.company_id)
        const rewardsErc721Count: TotalOneType = await pg('rewards_erc721')
            .count('reward_event_erc721.id as count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .first()
            .where('rewards_erc721.company_id', getCompany.company_id)
        const total: Total = {
            erc20: +rewardsErc20Count.count,
            erc721: +rewardsErc721Count.count
        }
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards total count',
                type: SuccessResponseTypes.object,
                data: total
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function getUserCount(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const rewardedUsersErc20Count: Array<{user_id: string}> = await pg('rewards_erc20')
            .distinct('reward_event_erc20.user_id as user_id')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .where('rewards_erc20.company_id', getCompany.company_id)
        const rewardedUsersErc721Count: Array<{user_id: string}> = await pg('rewards_erc721')
            .distinct('reward_event_erc721.user_id as user_id')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .where('rewards_erc721.company_id', getCompany.company_id)

        const uniqueUserIds = new Set([...rewardedUsersErc20Count, ...rewardedUsersErc721Count].map((user) => user.user_id))
        const totalUniqueUsers = uniqueUserIds.size
    
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards users count',
                type: SuccessResponseTypes.number,
                data: totalUniqueUsers
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function get24hCount(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const rewarded24hErc20Count: TotalOneType = await pg('rewards_erc20')
            .count('reward_event_erc20.id as count')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .first()
            .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo])
        const rewarded24hErc721Count: TotalOneType = await pg('rewards_erc721')
            .count('reward_event_erc721.id as count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .first()
            .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo])
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards 24h',
                type: SuccessResponseTypes.number,
                data: +rewarded24hErc20Count.count + +rewarded24hErc721Count.count
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function getDistribution(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const rewardsErc20Distribution: Array<Distribution> = await pg('rewards_erc20')
            .select('rewards_erc20.id', 'rewards_erc20.company_id', 'rewards_erc20.name')
            .count('reward_event_erc20.id as event_count')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .groupBy('rewards_erc20.id', 'rewards_erc20.company_id', 'rewards_erc20.name')
            .where('rewards_erc20.company_id', getCompany.company_id)
        const rewardsErc721Distribution: Array<Distribution> = await pg('rewards_erc721')
            .select('rewards_erc721.id', 'rewards_erc721.company_id', 'rewards_erc721.name')
            .count('reward_event_erc721.id as event_count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .groupBy('rewards_erc721.id', 'rewards_erc721.company_id', 'rewards_erc721.name')
            .where('rewards_erc721.company_id', getCompany.company_id)
        const totalDistribution = [...rewardsErc20Distribution, ...rewardsErc721Distribution]
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards distribution',
                type: SuccessResponseTypes.array,
                data: totalDistribution
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function getRewardEventsRange(getCompany: GetCompany, dateRange: DateRange): Promise<ErrorResponse | SuccessResponse> {
    try {
        const intervals = 30;
        const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);

        const query = await pg.raw(`
            WITH all_events AS (
                (SELECT id, event_datetime FROM reward_event_erc20
                WHERE event_datetime >= ? AND event_datetime <= ?)
                UNION
                (SELECT id, event_datetime FROM reward_event_erc721
                WHERE event_datetime >= ? AND event_datetime <= ?)
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
        `, [dateRange.startDate, dateRange.endDate, dateRange.startDate, dateRange.endDate, dateRange.startDate, dateRange.endDate, `${intervalSize} milliseconds`]);
        console.log(query.rows)
        const result: Array<DateInterval> = query.rows;

        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'New users range',
                type: SuccessResponseTypes.array,
                data: result
            }
        }

        return res;
    } catch (error: any) {
        console.log(error.message);
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }

        return err;
    }
}