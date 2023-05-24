import { ethers } from "ethers";
import pg from "../config/db";
import { ClaimNFT, ClaimToken, Delete, GetCompany, NFT, NFTCollection, NFTReward, RewardNFTEvent, RewardTokenEvent, RewardWithToken, Token, TokenReward, UpdateNFTReward, UpdateTokenReward, User } from "../entities";
import { config } from "../config/config";
import { signNFTReward, signTokenReward } from "../utils/sign";
import { Company } from "../entities";

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
        return tokenRewards
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function deleteTokenReward(getCompany: GetCompany, Delete: Delete): Promise<boolean> {
    try {
        const count = await pg('rewards_erc20')
            .count('reward_event_erc20.reward_id')
            .whereRaw('rewards_erc20.id = ? AND rewards_erc20.company_id = ?', [Delete.id, getCompany.company_id])
            .leftJoin('reward_event_erc20', 'reward_event_erc20.reward_id', '=', 'rewards_erc20.id')
            .whereRaw('reward_event_erc20.status = 1')
            .select([])
        if (count[0].count !== '0') throw Error('You have reward events on thihs')
        await pg('rewards_erc20').where({id: Delete.id, company_id: getCompany.company_id}).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function rewardWithToken(getCompany: GetCompany, reward: RewardWithToken): Promise<boolean> {
    try {
        const tokenReward: TokenReward = 
            await pg('rewards_erc20')
            .whereRaw('rewards_erc20.id = ?', [reward.reward_id])
            .leftJoin('erc20_tokens', 'erc20_tokens.address', '=', 'rewards_erc20.address')
            .select([
                'rewards_erc20.id', 'rewards_erc20.company_id',
                'rewards_erc20.name', 'rewards_erc20.description',
                'erc20_tokens.symbol', 'erc20_tokens.chainid',
                'rewards_erc20.address', 'rewards_erc20.amount',
                'erc20_tokens.fpmanager'
            ]).first()
        if (tokenReward.company_id !== getCompany.company_id) throw Error('Not allowed company')
        const network = config.networks.find(n => n.chainid == tokenReward.chainid)
        const provider = new ethers.providers.JsonRpcProvider(network?.rpc)
        const signer = new ethers.Wallet(network?.private_key || '', provider)
        const user: User = await pg('users').where({id: reward.user_id}).first()
        const signature = await signTokenReward(tokenReward.amount, user.wallet, signer, tokenReward.fpmanager ? tokenReward.fpmanager : '', tokenReward.address)
        await pg('reward_event_erc20').insert({
            status: 1,
            reward_id: reward.reward_id,
            user_id: reward.user_id,
            comment: reward.comment,
            v: signature.v,
            r: signature.r,
            s: signature.s
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getRewardTokenEvents(getCompany: GetCompany): Promise<Array<RewardTokenEvent>> {
    try {
        let rewardEvents: Array<RewardTokenEvent> = await pg('rewards_erc20')
            .whereRaw('rewards_erc20.company_id = ?', [getCompany.company_id])
            .leftJoin('reward_event_erc20', 'reward_event_erc20.reward_id', '=', 'rewards_erc20.id')
            .leftJoin('users', 'users.id', '=', 'reward_event_erc20.user_id')
            .leftJoin('erc20_tokens', 'erc20_tokens.address', '=', 'rewards_erc20.address')
            .leftJoin('reward_event_statuses', 'reward_event_statuses.id', '=', 'reward_event_erc20.status')
            .select([
                'rewards_erc20.id as reward_id', 'rewards_erc20.name as reward_name',
                'users.id as user_id', 'users.external_id as user_external_id', 
                'reward_event_erc20.id as event_id', 'reward_event_statuses.status as status',
                'rewards_erc20.address as token_address', 'erc20_tokens.symbol as token_symbol',
                'rewards_erc20.amount as token_amount', 'reward_event_erc20.comment as event_comment'
            ])
        rewardEvents = rewardEvents.filter(v => v.user_id !== null)
        return rewardEvents
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function addNFTReward(getCompany: GetCompany, nftReward: NFTReward): Promise<NFTReward | undefined> {
    try {
        nftReward.company_id = getCompany.company_id
        const company: GetCompany = 
            await pg('nfts')
            .whereRaw('nfts.id = ?', [nftReward.nft_id])
            .leftJoin('erc721_tokens', 'nfts.address','=','erc721_tokens.address')
            .select('erc721_tokens.company_id as company_id')
            .first()
        if (!company.company_id) throw Error('Not this company')
        const addedReward: Array<NFTReward> = await pg('rewards_erc721').insert(nftReward).returning('*')
        const nftCollection: any = 
            await pg('nfts')
                .whereRaw('nfts.id = ?', [addedReward[0].nft_id])
                .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
                .select(['erc721_tokens.symbol', 'nfts.name as nft_name'])
                .first()
        addedReward[0].symbol = nftCollection.symbol
        addedReward[0].nft_name = nftCollection.nft_name
        return addedReward[0]
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export async function getNFTRewards(getCompany: GetCompany): Promise<Array<NFTReward>> {
    try {
        const nftRewards: Array<NFTReward> = 
            await pg('rewards_erc721')
                .count('reward_event_erc721.user_id')
                .whereRaw('rewards_erc721.company_id = ?', [getCompany.company_id]) 
                .leftJoin('nfts', 'rewards_erc721.nft_id', '=', 'nfts.id')
                .leftJoin('erc721_tokens', 'nfts.address', '=', 'erc721_tokens.address')
                .leftJoin('reward_event_erc721', 'rewards_erc721.id', '=', 'reward_event_erc721.reward_id')
                .groupBy('rewards_erc721.id', 'rewards_erc721.name','rewards_erc721.description', 'rewards_erc721.nft_id', 'erc721_tokens.symbol','nfts.name', 'nfts.address')
                .select(['rewards_erc721.id', 'rewards_erc721.name','rewards_erc721.description', 'rewards_erc721.nft_id', 'erc721_tokens.symbol', 'nfts.name as nft_name', 'nfts.address as address'])
        return nftRewards
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function deleteNFTReward(getCompany: GetCompany, Delete: Delete): Promise<boolean> {
    try {
        const count = await pg('rewards_erc721')
            .count('reward_event_erc721.reward_id')
            .whereRaw('rewards_erc721.id = ? AND rewards_erc721.company_id = ?', [Delete.id, getCompany.company_id])
            .leftJoin('reward_event_erc721', 'reward_event_erc721.reward_id', '=', 'rewards_erc721.id')
            .whereRaw('reward_event_erc721.status = 1')
            .select([])
        if (count[0].count !== '0') throw Error('You have reward events on thihs')
        await pg('rewards_erc721').where({id: Delete.id, company_id: getCompany.company_id}).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function rewardWithNFT(getCompany: GetCompany, reward: RewardWithToken): Promise<boolean> {
    try {
        const nftReward: NFTReward = 
            await pg('rewards_erc721')
                .whereRaw('rewards_erc721.id = ?', [reward.reward_id])
                .first()
                .leftJoin('nfts','nfts.id','=','rewards_erc721.nft_id')
                .select(['*', 'nfts.name as nft_name', 'nfts.id as nft_id', 'nfts.chainid as chainid'])
        if (nftReward.company_id !== getCompany.company_id) throw Error('Not allowed company')
        const network = config.networks.find(n => n.chainid == nftReward.chainid)
        const provider = new ethers.providers.JsonRpcProvider(network?.rpc)
        const signer = new ethers.Wallet(network?.private_key || '', provider)
        const user: User = await pg('users').where({id: reward.user_id}).first()
        const signature = await signNFTReward(nftReward.image ? nftReward.image : '', user.wallet, signer, nftReward.address ? nftReward.address : '')
        await pg('reward_event_erc721').insert({
            status: 1,//Accrued
            reward_id: reward.reward_id,
            user_id: reward.user_id,
            comment: reward.comment,
            v: signature.v,
            r: signature.r,
            s: signature.s
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getRewardNFTEvents(getCompany: GetCompany): Promise<Array<RewardNFTEvent>> {
    try {
        let rewardEvents: Array<RewardNFTEvent> = await pg('rewards_erc721')
            .whereRaw('rewards_erc721.company_id = ?', [getCompany.company_id])
            .leftJoin('reward_event_erc721', 'reward_event_erc721.reward_id', '=', 'rewards_erc721.id')
            .leftJoin('users', 'users.id', '=', 'reward_event_erc721.user_id')
            .leftJoin('nfts', 'nfts.id', '=', 'rewards_erc721.nft_id')
            .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
            .leftJoin('reward_event_statuses', 'reward_event_statuses.id', '=', 'reward_event_erc721.status')
            .select([
                'rewards_erc721.id as reward_id', 'rewards_erc721.name as reward_name',
                'users.id as user_id', 'users.external_id as user_external_id', 
                'reward_event_erc721.id as event_id', 'reward_event_statuses.status as status',
                'nfts.address as token_address', 'erc721_tokens.symbol as token_symbol',
                'reward_event_erc721.comment as event_comment', 'nfts.name as nft_name',
                'nfts.id as nft_id'
            ])
        rewardEvents = rewardEvents.filter(v => v.user_id !== null)
        return rewardEvents
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getClaimableToken(rewardEventID: string, user_id: string): Promise<ClaimToken | null> {
    try {
        const claimableToken: ClaimToken =
            await pg('reward_event_erc20')
                .whereRaw('reward_event_erc20.id = ? AND reward_event_erc20.user_id = ?', [rewardEventID, user_id])
                .first()
                .leftJoin('rewards_erc20', 'rewards_erc20.id', '=', 'reward_event_erc20.reward_id')
                .leftJoin('erc20_tokens', 'erc20_tokens.address', '=', 'rewards_erc20.address')
                .leftJoin('users', 'users.id', '=', 'reward_event_erc20.user_id')
                .select([
                    'erc20_tokens.name as token_name', 'erc20_tokens.symbol as token_symbol',
                    'erc20_tokens.address as token_address', 'erc20_tokens.fpmanager', 'rewards_erc20.name as reward_name',
                    'rewards_erc20.description as reward_description', 'rewards_erc20.amount as reward_amount',
                    'erc20_tokens.chainid', 'users.id as user_id', 'users.wallet as user_wallet',
                    'reward_event_erc20.v','reward_event_erc20.r','reward_event_erc20.s'
                ])

        return claimableToken
    } catch (error) {
        return null
    }
}

export async function getClaimableNFT(rewardEventID: string, user_id: string): Promise<ClaimNFT | null> {
    try {
        const claimableNFT: ClaimNFT =
            await pg('reward_event_erc721')
                .whereRaw('reward_event_erc721.id = ? AND reward_event_erc721.user_id = ?', [rewardEventID, user_id])
                .first()
                .leftJoin('rewards_erc721', 'rewards_erc721.id', '=', 'reward_event_erc721.reward_id')
                .leftJoin('nfts', 'nfts.id', '=', 'rewards_erc721.nft_id')
                .leftJoin('users', 'users.id', '=', 'reward_event_erc721.user_id')
                .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
                .select([
                    'erc721_tokens.name as collection_name', 'erc721_tokens.address as collection_address',
                    'nfts.name as nft_name', 'nfts.image as nft_image',
                    'nfts.description as nft_description', 'nfts.chainid as chainid',
                    'users.wallet as user_wallet',
                    'reward_event_erc721.v as v', 'reward_event_erc721.s as s', 'reward_event_erc721.r as r',
                    'erc721_tokens.beneficiary as beneficiary'
                ])
        return claimableNFT
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function updateTokenReward(getCompany: GetCompany, tokenReward: UpdateTokenReward): Promise<boolean> {
    try {
        const rewardEvent: any = await pg('reward_event_erc20').count('id').where({reward_id: tokenReward.id}).first()
        //if some reward event exist with this reward then can't update token
        if (rewardEvent.count != 0) {
            tokenReward.address = undefined
        }
        await pg('rewards_erc20').update(tokenReward).where({company_id: getCompany.company_id, id: tokenReward.id})
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function updateNFTReward(getCompany: GetCompany, nftReward: UpdateNFTReward): Promise<boolean> {
    try {
        //check if nft_id is in that collection
        const rewardEvent: any = await pg('reward_event_erc721').count('id').where({reward_id: nftReward.id}).first()
        //if some reward event exist with this reward then can't update token
        if (rewardEvent.count != 0) {
            nftReward.nft_id = undefined
        }
        await pg('rewards_erc721').update(nftReward).where({company_id: getCompany.company_id, id: nftReward.id})
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function deleteTokenRewardEvent(getCompany: GetCompany, deleteRewardEvent: Delete): Promise<boolean> {
    try {
        const rewardCompany: Company = 
            await pg('reward_event_erc20')
            .whereRaw('reward_event_erc20.id = ?', deleteRewardEvent.id)
            .leftJoin('rewards_erc20', 'rewards_erc20.id', '=', 'reward_event_erc20.reward_id')
            .first()
            .select(['rewards_erc20.company_id as id'])
        if (rewardCompany.id !== getCompany.company_id) throw Error('Not this company token reward')
        await pg('reward_event_erc20').whereRaw('id = ? AND status = 1', [deleteRewardEvent.id]).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function deleteNFTRewardEvent(getCompany: GetCompany, deleteRewardEvent: Delete): Promise<boolean> {
    try {
        const rewardCompany: Company = 
            await pg('reward_event_erc721')
            .whereRaw('reward_event_erc721.id = ?', deleteRewardEvent.id)
            .leftJoin('rewards_erc721', 'rewards_erc721.id', '=', 'reward_event_erc721.reward_id')
            .first()
            .select(['rewards_erc721.company_id as id'])
        if (rewardCompany.id !== getCompany.company_id) throw Error('Not this company token reward')
        await pg('reward_event_erc721').whereRaw('id = ? AND status = 1', [deleteRewardEvent.id]).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}