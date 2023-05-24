export interface User {
    id?: string,
    external_id: string,
    email:  string,
    wallet:  string,
    image?: string,
    notes?: string,
    properties?: Array<Property>,
    stats?: Array<Stat>,
    nft_rewards?: Array<UserNFTReward>,
    token_rewards?: Array<UserTokenReward>
}

export interface UpdateUser {
    id?: string,
    external_id?: string,
    email?:  string,
    wallet?:  string,
    image?: string,
    notes?: string,
    properties?: Array<Property>,
    stats?: Array<Stat>
}

export interface Property {
    name: string,
    value: string,
    user_id?: string,
    company_id?: string
}

export interface Stat {
    name: string,
    value: number,
    user_id?: string,
    company_id?: string
}

export interface UserNFTReward {
    reward_name: string,
    nft_name: string,
    collection_name: string,
    count: number
}

export interface UserTokenReward {
    token_name: string,
    reward_name: string,
    count: number
}