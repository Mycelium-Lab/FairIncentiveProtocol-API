import { ethers } from "ethers";
import pg from "../../config/db";
import { DateInterval, DateRange, ErrorResponse, GetCompany, SuccessResponse } from "../../entities";
import { CODES, SuccessResponseTypes } from "../../utils/constants";

export async function getTotalCount(getCompany: GetCompany) {
    try {
        const total: any = await pg('reward_event_erc20')
            .sum('rewards_erc20.amount as total')            
            .innerJoin('rewards_erc20', 'reward_event_erc20.reward_id', 'rewards_erc20.id')
            .whereRaw('rewards_erc20.company_id = ?', [getCompany.company_id])
            .first()
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards total count',
                type: SuccessResponseTypes.number,
                data: ethers.utils.formatEther(total.total || '0')
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

export async function getCount24h(getCompany: GetCompany) {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
        const total24h: any = await pg('reward_event_erc20')
            .sum('rewards_erc20.amount as total')
            .innerJoin('rewards_erc20', 'reward_event_erc20.reward_id', 'rewards_erc20.id')
            .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo])
            .first()
        const total48h: any = await pg('reward_event_erc20')
            .sum('rewards_erc20.amount as total')
            .innerJoin('rewards_erc20', 'reward_event_erc20.reward_id', 'rewards_erc20.id')
            .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ? AND reward_event_erc20.event_datetime <= ?', [getCompany.company_id, fortyEightHoursAgo, twentyFourHoursAgo])
            .first()
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards total count',
                type: SuccessResponseTypes.number,
                data: {
                    twentyFourHoursAgo: ethers.utils.formatEther(total24h.total || '0'),
                    fortyEightHoursAgo: ethers.utils.formatEther(total48h.total || '0')
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

export async function getTokensDistRange(getCompany: GetCompany, dateRange: DateRange): Promise<ErrorResponse | SuccessResponse> {
    try {
        const intervals = 30;
        const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals);

        const query = await pg.raw(`
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
        const result: Array<DateInterval> = query.rows;

        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Tokens dist range',
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