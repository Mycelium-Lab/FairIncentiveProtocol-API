import pg from "../config/db";
import { DeleteReward, GetCompany, RewardWithToken, Token, TokenReward } from "../entities";

export async function addTokenReward(getCompany: GetCompany, tokenReward: TokenReward): Promise<TokenReward | undefined> {
    try {
        tokenReward.company_id = getCompany.company_id
        const addedReward: Array<TokenReward> = await pg('rewards_erc20').insert(tokenReward).returning('*')
        const token: Token = await pg('erc20_tokens').select('*').where({address: tokenReward.address}).first()
        addedReward[0].symbol = token.symbol
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
                .count('reward_event_erc20.user_id')
                .whereRaw('rewards_erc20.company_id = ?', [getCompany.company_id]) 
                .leftJoin('erc20_tokens', 'rewards_erc20.address', '=', 'erc20_tokens.address')
                .leftJoin('reward_event_erc20', 'rewards_erc20.id', '=', 'reward_event_erc20.reward_id')
                .groupBy('rewards_erc20.id', 'rewards_erc20.name','rewards_erc20.description', 'rewards_erc20.amount', 'rewards_erc20.address', 'erc20_tokens.symbol')
                .select(['rewards_erc20.id', 'rewards_erc20.name','rewards_erc20.description', 'rewards_erc20.amount', 'rewards_erc20.address', 'erc20_tokens.symbol'])
        console.log(tokenRewards)
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

export async function rewardWithToken(getCompany: GetCompany, reward: RewardWithToken): Promise<boolean> {
    try {
        const tokenReward: TokenReward = await pg('rewards_erc20').select('*').where({id: reward.reward_id}).first()
        if (tokenReward.company_id !== getCompany.company_id) throw Error('Not allowed company')
        await pg('reward_event_erc20').insert({
            status: 1,
            reward_id: reward.reward_id,
            user_id: reward.user_id,
            comment: reward.comment
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}