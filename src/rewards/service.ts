import pg from "../config/db";
import { GetCompany, TokenReward } from "../entities";

export async function addTokenReward(getCompany: GetCompany, tokenReward: TokenReward): Promise<boolean> {
    try {
        tokenReward.company_id = getCompany.company_id
        await pg('rewards_token').insert(tokenReward)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getTokenRewards(getCompany: GetCompany): Promise<Array<TokenReward>> {
    try {
        const tokenRewards: Array<TokenReward> = 
            await pg('rewards_token')
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