export interface RewardNFTEvent {
    reward_id: string,
    reward_name: string,
    user_id: string,
    user_external_id: string, //user
    event_id: string,
    status: string,
    token_address: string,
    token_symbol: string,
    event_comment: string,
    nft_name: string,
    nft_id: string
}