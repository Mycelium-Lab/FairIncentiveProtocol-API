import pg from "../../config/db";
import { ErrorResponse, GetCompany, SuccessResponse, TotalOneType } from "../../entities";
import { CODES, SuccessResponseTypes } from "../../utils/constants";

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