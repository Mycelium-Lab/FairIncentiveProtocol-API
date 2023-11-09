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
                data: rewarded24hErc721Count.count
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