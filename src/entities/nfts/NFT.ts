export interface NFT {
    collection_address: string,
    collection_name: string,
    chainid: string,
    image: string,
    nft_id: string,
    nft_name: string,
    nft_description: string | null,
    nft_amount: number | null,
    rewards_count?: number
}