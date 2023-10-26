import pg from "../../config/db";
import { Distribution, ErrorResponse, GetCompany, SuccessResponse, Total } from "../../entities";
import { CODES, SuccessResponseTypes } from "../../utils/constants";

export async function getTotalCount(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const rewardsErc20Count: Total = await pg('rewards_erc20')
            .count('reward_event_erc20.id as count')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .first()
            .where('rewards_erc20.company_id', getCompany.company_id)
        const rewardsErc721Count: Total = await pg('rewards_erc721')
            .count('reward_event_erc721.id as count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .first()
            .where('rewards_erc721.company_id', getCompany.company_id)
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards total count',
                type: SuccessResponseTypes.number,
                data: +rewardsErc20Count.count + +rewardsErc721Count.count
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
        const rewardedUsersErc20Count: Total = await pg('rewards_erc20')
            .countDistinct('reward_event_erc20.user_id as count')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .first()
            .where('rewards_erc20.company_id', getCompany.company_id)
        const rewardedUsersErc721Count: Total = await pg('rewards_erc721')
            .countDistinct('reward_event_erc721.user_id as count')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .first()
            .where('rewards_erc721.company_id', getCompany.company_id)
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Rewards users count',
                type: SuccessResponseTypes.number,
                data: +rewardedUsersErc20Count.count + +rewardedUsersErc721Count.count
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
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const rewarded24hErc20Count: Total = await pg('rewards_erc20')
            .count('reward_event_erc20.id as count')
            .leftJoin('reward_event_erc20', 'rewards_erc20.id', 'reward_event_erc20.reward_id')
            .first()
            .whereRaw('rewards_erc20.company_id = ? AND reward_event_erc20.event_datetime >= ?', [getCompany.company_id, twentyFourHoursAgo])
        const rewarded24hErc721Count: Total = await pg('rewards_erc721')
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