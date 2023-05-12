export interface RewardTokenEvent {
    reward_id: string,
    reward_name: string,
    user_id: string,
    user_external_id: string, //user
    event_id: string,
    status: string,
    token_address: string,
    token_symbol: string,
    token_amount: string,
    event_comment: string
}