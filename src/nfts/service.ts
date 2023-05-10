import pg from "../config/db";
import { AddNFT, Company, GetCompany, NFT } from "../entities";

export async function addNFT(nft: AddNFT, getCompany: GetCompany): Promise<boolean> {
    try {
        await pg('erc721_tokens')
            .insert({
                company_id: getCompany.company_id,
                name: nft.name,
                symbol: nft.symbol,
                chain_id: nft.chainid,
                address: nft.address,
                beneficiary: nft.address
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getNFTs(getCompany: GetCompany): Promise<Array<NFT>> {
    try {
        const tokens: Array<NFT> = await pg('erc721_tokens')
            .select('*')
            .where({
                company_id: getCompany.company_id
            })
        return tokens
    } catch (error) {
        console.log(error)
        return []
    }
}