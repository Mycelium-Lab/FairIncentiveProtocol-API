import { config } from "../config/config";
import pg from "../config/db";
import { AddNFT, AddNFTCollection, Company, Delete, GetCompany, NFT, NFTCollection, NFTReward } from "../entities";

export async function addNFTCollection(nftCollection: AddNFTCollection, getCompany: GetCompany): Promise<boolean> {
    try {
        const trx = await pg.transaction()
        const done: boolean = await trx('erc721_tokens')
            .insert({
                company_id: getCompany.company_id,
                name: nftCollection.name,
                symbol: nftCollection.symbol,
                description: nftCollection.description,
                chainid: nftCollection.chainid,
                address: nftCollection.address,
                beneficiary: nftCollection.beneficiary,
                royalty_percent: nftCollection.royalties
            })
            .then(async () => {
                nftCollection.links.forEach(v => {
                    v.company_id = getCompany.company_id
                    v.token_address = nftCollection.address
                    v.chainid = nftCollection.chainid
                })
                if (nftCollection.links.length) await trx('social_links').insert(nftCollection.links)
            })
            .then(async () => {
                await trx.commit()
                return true
            })
            .catch(async (err) => {
                console.log(err)
                await trx.rollback()
                return false
            })
        return done
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
            chainid: nft.chainid,
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
        //TODO: Попробовать убрать reduce чтобы все было в запрос
        //сейчас reduce нужен чтобы объединять nft по коллекциям
        const nfts: Array<NFT> =
            await pg('erc721_tokens')
                .whereRaw('erc721_tokens.company_id = ?', [getCompany.company_id])
                .join('nfts', 'nfts.address', '=', 'erc721_tokens.address')
                .leftJoin('rewards_erc721', 'rewards_erc721.nft_id', '=', 'nfts.id')
                .groupBy('erc721_tokens.address', 'erc721_tokens.name', 'erc721_tokens.chainid', 'nfts.image', 'nfts.id', 'nfts.name', 'nfts.description', 'nfts.amount')
                .select([
                    'erc721_tokens.address as collection_address',
                    'erc721_tokens.name as collection_name',
                    'erc721_tokens.chainid as chainid',
                    'nfts.image as image',
                    'nfts.id as nft_id',
                    'nfts.name as nft_name',
                    'nfts.description as nft_description',
                    'nfts.amount as nft_amount',
                pg.raw('COUNT(DISTINCT rewards_erc721.nft_id) as rewards_count') // Изменяем подсчет на COUNT(DISTINCT)
                ]);
        const result: Array<NFT> = nfts.reduce((acc: any, item) => {
            if (!acc[item.collection_address]) {
                acc[item.collection_address] = [];
            }
            acc[item.collection_address].push(item);
            return acc;
            }, {});
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function deleteNFT(nft: Delete, getCompany: GetCompany): Promise<boolean> {
    try {
        const company: Company = await pg('nfts')
            .whereRaw('nfts.id = ?', [nft.id])
            .leftJoin('erc721_tokens', 'erc721_tokens.address', '=', 'nfts.address')
            .first()
            .select('erc721_tokens.company_id as id')
        if (company.id !== getCompany.company_id) throw Error('Not your nft')
        const reward: Array<NFTReward> = await pg('rewards_erc721').where({nft_id: nft.id}).select('*')
        if (reward.length) throw Error('This nft in reward')
        await pg('nfts').where({id: nft.id}).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}