import pg from "../config/db";
import { DeleteReward, GetCompany, TokenReward } from "../entities";

export async function addTokenReward(getCompany: GetCompany, tokenReward: TokenReward): Promise<TokenReward | undefined> {
    try {
        tokenReward.company_id = getCompany.company_id
        const addedReward: Array<TokenReward> = await pg('rewards_erc20').insert(tokenReward).returning('*')
        return addedReward[0]
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export async function getTokenRewards(getCompany: GetCompany): Promise<Array<TokenReward>> {
    try {
        const tokenRewards: Array<TokenReward> = 
            await pg('rewards_erc20')
                .select('*')
                .where({
                    company_id: getCompany.company_id
                })       
        return tokenRewards
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function deleteTokenReward(getCompany: GetCompany, deleteReward: DeleteReward): Promise<boolean> {
    try {
        await pg('rewards_erc20').where({id: deleteReward.id, company_id: getCompany.company_id}).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}