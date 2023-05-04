import pg from "../config/db";
import { AddNFT, Company, GetCompany, NFT } from "../entities";

export async function addNFT(nft: AddNFT, getCompany: GetCompany): Promise<boolean> {
    try {
        const company: Company = 
            await pg('companies')
                .select('*')
                .where(getCompany.email ? {email: getCompany.email} : {phone: getCompany.phone})
                .first()
        await pg('erc721_tokens')
            .insert({
                company_id: company.id,
                name: nft.name,
                symbol: nft.symbol,
                chain_id: nft.chainid,
                address: nft.address,
                beneficiary: company.wallet
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getNFTs(getCompany: GetCompany): Promise<Array<NFT>> {
    try {
        const company: Company = 
            await pg('companies')
                .select('*')
                .where(getCompany.email ? {email: getCompany.email} : {phone: getCompany.phone})
                .first()
        const tokens: Array<NFT> = await pg('erc721_tokens')
            .select('*')
            .where({
                company_id: company.id
            })
        return tokens
    } catch (error) {
        console.log(error)
        return []
    }
}