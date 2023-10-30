import pg from "../../config/db"
import { DateEnd, DateInterval, DateRange, ErrorResponse, GetCompany, SuccessResponse, TotalOneType } from "../../entities"
import { CODES, SuccessResponseTypes } from "../../utils/constants"

export async function getTotalCount(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const total: TotalOneType = await pg('users')
            .count('id as count')
            .first()
            .where('company_id', getCompany.company_id)
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Users total count',
                type: SuccessResponseTypes.number,
                data: total.count
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
        const usersAdded24hAgo: TotalOneType = await pg('users')
            .count('id as count')
            .first()
            .whereRaw('company_id = ? AND add_datetime >= ?', [ getCompany.company_id, twentyFourHoursAgo ])
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Users 24h count',
                type: SuccessResponseTypes.number,
                data: usersAdded24hAgo.count
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

export async function getActive(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        const rewarded60daysErc20Count: any = await pg('rewards_erc20')
            .distinct('reward_event_erc20.user_id')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ?', [getCompany.company_id, sixtyDaysAgo])
        const rewarded60daysErc721Count: any = await pg('rewards_erc721')
            .distinct('reward_event_erc721.user_id ')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .whereRaw('rewards_erc721.company_id = ? AND reward_event_erc721.event_datetime >= ?', [getCompany.company_id, sixtyDaysAgo])
        const uniqueUserIds = new Set([...rewarded60daysErc20Count, ...rewarded60daysErc721Count].map((user) => user.user_id))
        const totalUniqueUsers = uniqueUserIds.size
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Users 24h count',
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

export async function getNewUsersRange(getCompany: GetCompany, dateRange: DateRange): Promise<ErrorResponse | SuccessResponse> {
    try {
        const intervals = 30
        const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals)
        const query = await pg.raw(`
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
            "add_datetime" < intervals.date_interval_end
            GROUP BY date_interval_start, date_interval_end
            ORDER BY date_interval_start;
        `, [dateRange.startDate, dateRange.endDate, `${intervalSize} milliseconds`])
        const result: Array<DateInterval> = query.rows
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'New users range',
                type: SuccessResponseTypes.array,
                data: result
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

export async function getTotalUsersRange(getCompany: GetCompany, dateRange: DateRange): Promise<ErrorResponse | SuccessResponse> {
    try {
        const intervals = 30
        const intervalSize = Math.floor((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / intervals)
        let dates: any = []
        for (let i = 0; i <= intervals; i++) {
            dates.push(new Date(new Date(i === 0 ? dateRange.startDate.toISOString() : dates[i-1]).getTime() + intervalSize).toISOString())
        }
        dates = dates.map((v: any) => `'${v}'`)
        const query = await pg.raw(`
            SELECT
            end_date,
            COUNT(id) AS count
            FROM (
            SELECT
                unnest(ARRAY[${dates.join(', ')}]::timestamptz[]) AS end_date
            ) AS end_dates
            LEFT JOIN users ON add_datetime <= end_date
            GROUP BY end_date
            ORDER BY end_date;
        `);
        const result: Array<DateEnd> = query.rows
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Total users range',
                type: SuccessResponseTypes.array,
                data: result
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