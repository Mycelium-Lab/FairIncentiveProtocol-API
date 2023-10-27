import pg from "../../config/db"
import { DateInterval, DateRange, ErrorResponse, GetCompany, SuccessResponse, TotalOneType } from "../../entities"
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