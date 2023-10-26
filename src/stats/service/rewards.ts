import pg from "../../config/db";
import { ErrorResponse, GetCompany, SuccessResponse, Total } from "../../entities";
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