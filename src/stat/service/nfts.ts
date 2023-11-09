import pg from "../../config/db";
import { DateInterval, DateRange, ErrorResponse, GetCompany, SuccessResponse, TotalOneType } from "../../entities";
import { CODES, SuccessResponseTypes } from "../../utils/constants";

export async function getTotalCount(getCompany: GetCompany) {
    try {
        const rewardsErc721Count: TotalOneType = await pg('rewards_erc721')
            .count('reward_event_erc721.id as count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .first()
            .where('rewards_erc721.company_id', getCompany.company_id)
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards total count',
                type: SuccessResponseTypes.number,
                data: rewardsErc721Count.count
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
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
        const rewarded24hErc721Count: TotalOneType = await pg('rewards_erc721')
            .count('reward_event_erc721.id as count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .first()
            .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo])
        const rewarded48hErc721Count: TotalOneType = await pg('rewards_erc721')
            .count('reward_event_erc721.id as count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .first()
            .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ? AND reward_event_erc721.event_datetime <= ?', [getCompany.company_id, fortyEightHoursAgo, twentyFourHoursAgo])
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards 24h',
                type: SuccessResponseTypes.number,
                data: {
                    twentyFourHoursAgo: rewarded24hErc721Count.count,
                    fortyEightHoursAgo: rewarded48hErc721Count.count
                }
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

export async function getNftsDistRange(getCompany: GetCompany, dateRange: DateRange): Promise<ErrorResponse | SuccessResponse> {
    try {
        const intervals = 30;
        const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);

        const query = await pg.raw(`
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

        const result: Array<DateInterval> = query.rows;

        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Nfts dist range',
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