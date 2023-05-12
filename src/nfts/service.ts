import { ethers } from "ethers";
import { config } from "../config/config";
import pg from "../config/db";
import { AddNFT, AddNFTCollection, Company, GetCompany, NFT, NFTCollection } from "../entities";

export async function addNFTCollection(nftCollection: AddNFTCollection, getCompany: GetCompany): Promise<boolean> {
    try {
        await pg('erc721_tokens')
            .insert({
                company_id: getCompany.company_id,
                name: nftCollection.name,
                symbol: nftCollection.symbol,
                chain_id: nftCollection.chainid,
                address: nftCollection.address,
                beneficiary: nftCollection.address
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getNFTCollections(getCompany: GetCompany): Promise<Array<NFTCollection>> {
    try {
        const tokens: Array<NFTCollection> = await pg('erc721_tokens')
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

export async function addNFT(nft: AddNFT, getCompany: GetCompany): Promise<boolean> {
    try {   
        const collection: Array<NFTCollection> = await pg('erc721_tokens').select('*').where({company_id: getCompany.company_id, address: nft.address})
        if (!collection.length) throw Error('Not found this collection')
        await pg('nfts').insert({
            address: nft.address,
            image: "https://gateway.pinata.cloud/ipfs/QmX9qWa4p1Te3PhdRpyyY1SSvdgY9JAjVcGX2sy8HtaFn4?_gl=1*owkaeo*rs_ga*NzVlMGVjN2MtMTExNC00MmRkLTg2ZjQtZGZkZWMyOGY3Nzg4*rs_ga_5RMPXG14TE*MTY4Mzg3OTYxNi42LjEuMTY4Mzg4MDE3Ni42MC4wLjA",
            chain_id: nft.chainid,
            amount: nft.amount,
            name: nft.name,
            description: nft.description
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getNFTs(getCompany: GetCompany): Promise<Array<NFT>> {
    try {
        const nfts: Array<NFT> = 
            await pg('erc721_tokens')
            .whereRaw('erc721_tokens.company_id = ?', [getCompany.company_id])
            .join('nfts', 'nfts.address', '=', 'erc721_tokens.address')
            .select([
                'erc721_tokens.address as collection_address',
                'erc721_tokens.name as collection_name',
                'erc721_tokens.chain_id as chainid',
                'nfts.image as image',
                'nfts.name as nft_name',
                'nfts.description as nft_description',
                'nfts.amount as nft_amount'
            ])
        return nfts
    } catch (error) {
        console.log(error)
        return []
    }
}


// const network = config.networks.find(n => n.chainid == nft.chain_id)
// const provider = new ethers.providers.JsonRpcProvider(network?.rpc)
// const signer = new ethers.Wallet(network?.private_key || '', provider)

async function sign(
    uri: string, sender: string, signer: ethers.Wallet, contractAddress: string
) {
    const message = [uri, sender, contractAddress]
    const hashMessage = ethers.utils.solidityKeccak256([
        "string","uint160","uint160"
    ], message)
    const sign = await signer.signMessage(ethers.utils.arrayify(hashMessage));
    const r = sign.substr(0, 66)
    const s = `0x${sign.substr(66, 64)}`;
    const v = parseInt(`0x${sign.substr(130,2)}`);
    return {r,s,v}
}