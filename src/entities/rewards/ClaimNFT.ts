export interface ClaimNFT {
    collection_name: string,
    collection_address: string,
    nft_name: string,
    nft_image: string,
    nft_json_image: string;
    nft_description: string,
    chainid: string,
    user_wallet: string,
    beneficiary: string,
    v: string,
    r: string,
    s: string,
    status: number,
    reward_event_id: string
}