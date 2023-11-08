import { ethers } from "ethers";
import pg from "../../config/db";
import { ErrorResponse, GetCompany, SuccessResponse } from "../../entities";
import { CODES, SuccessResponseTypes } from "../../utils/constants";

export async function getTotalCount(getCompany: GetCompany) {
    try {
        const total: any = await pg('reward_event_erc20')
            .sum('rewards_erc20.amount as total')
            .innerJoin('rewards_erc20', 'reward_event_erc20.reward_id', 'rewards_erc20.id')
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