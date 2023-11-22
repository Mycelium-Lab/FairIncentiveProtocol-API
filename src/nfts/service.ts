import pg from "../config/db";
import { AddNFT, AddNFTCollection, BooleanResponse, Company, Delete, ErrorResponse, GetCompany, GetOneCollectionNft, NFT, NFTCollection, NFTReward, SuccessResponse } from "../entities";
import { CODES, SuccessResponseTypes } from "../utils/constants";

export async function addNFTCollection(nftCollection: AddNFTCollection, getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const trx = await pg.transaction()
        const newCollection: NFTCollection | string = await trx('erc721_tokens')
            .insert({
                company_id: getCompany.company_id,
                name: nftCollection.name,
                symbol: nftCollection.symbol,
                description: nftCollection.description,
                chainid: nftCollection.chainid,
                address: nftCollection.address,
                beneficiary: nftCollection.beneficiary,
                royalty_percent: nftCollection.royalties,
                logo_image: nftCollection.logo_image,
                featured_image: nftCollection.featured_image,
                banner_image: nftCollection.banner_image
            }, '*')
            .then(async (collections) => {
                nftCollection.links.forEach(v => {
                    v.company_id = getCompany.company_id
                    v.token_address = nftCollection.address
                    v.chainid = nftCollection.chainid
                })
                if (nftCollection.links.length) await trx('social_links').insert(nftCollection.links)
                return collections[0]
            })
            .then(async (collection) => {
                await trx.commit()
                return collection
            })
            .catch(async (err) => {
                await trx.rollback()
                return err.message
            })
        //If there is no error
        if (!(newCollection instanceof String)) {
            const res: SuccessResponse = {
                code: CODES.OK.code,
                body: {
                    message: 'The NFT collection was successfully added',
                    type: SuccessResponseTypes.object,
                    data: newCollection
                }
            }
            return res
        } else {
            const err: ErrorResponse = {
                code: CODES.INTERNAL_ERROR.code,
                error: {
                    name: CODES.INTERNAL_ERROR.name,
                    message: newCollection.toString()
                }
            }
            return err
        }
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function getNFTCollections(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const tokens: Array<NFTCollection> = await pg('erc721_tokens')
            .select('*')
            .where({
                company_id: getCompany.company_id
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'NFT Collections',
                type: SuccessResponseTypes.array,
                data: tokens
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }  
}

export async function addNFT(nft: AddNFT, getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {   
        const collection: Array<NFTCollection> = await pg('erc721_tokens').select('*').where({company_id: getCompany.company_id, address: nft.address})
        if (collection.length === 0) throw Error("The collection with this company and address was not found")
        const nfts = await pg('nfts').insert({
            address: nft.address,
            image: nft.image,
            amount: nft.amount,
            name: nft.name,
            description: nft.description,
            chainid: nft.chainid
        }, '*')
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'The NFT was successfully added',
                type: SuccessResponseTypes.object,
                data: nfts[0]
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }  
}

export async function getNFTs(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const result: any = await pg('erc721_tokens')
            .whereRaw('erc721_tokens.company_id = ?', [getCompany.company_id])
            .select([
                'erc721_tokens.address as collection_address',
                'erc721_tokens.name as collection_name',
                pg.raw(`
                    ARRAY(
                        SELECT JSON_BUILD_OBJECT(
                            'id', nfts.id,
                            'image', nfts.image,
                            'name', nfts.name,
                            'description', nfts.description,
                            'amount', nfts.amount,
                            'count', COUNT(rewards_erc721.nft_id)
                        )
                        FROM nfts
                        LEFT JOIN rewards_erc721 ON rewards_erc721.nft_id = nfts.id AND rewards_erc721.nft_id IS NOT NULL
                        WHERE nfts.address = erc721_tokens.address
                        GROUP BY nfts.id
                    ) as nfts
                `)
            ]);
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'NFTs',
                type: SuccessResponseTypes.array,
                data: result
            }
        }
        return res
    } catch (error: any) {
        console.log(error)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function getNFTsOneCollection(getCompany: GetCompany, getOneCollectionNft: GetOneCollectionNft): Promise<ErrorResponse | SuccessResponse> {
    try {
        const result = await pg('erc721_tokens')
            .select([
                'nfts.address as collection_address',
                'nfts.image as collection_image',
                'erc721_tokens.name as collection_name',
                'erc721_tokens.chainid',
                'nfts.image',
                'nfts.id as nft_id',
                'nfts.name as nft_name',
                'nfts.description as nft_description',
                'nfts.amount as nft_amount'
            ])
            .count('reward_event_erc721.id as rewards_count')
            .from('erc721_tokens')
            .join('nfts', 'erc721_tokens.chainid', 'nfts.chainid')
            .leftJoin('rewards_erc721', 'nfts.id', 'rewards_erc721.nft_id')
            .leftJoin('reward_event_erc721', 'rewards_erc721.id', 'reward_event_erc721.reward_id')
            .where({
                'erc721_tokens.company_id': getCompany.company_id,
                'erc721_tokens.address': getOneCollectionNft.address,
                'erc721_tokens.chainid': getOneCollectionNft.chainid
            })
            .groupBy('nfts.address', 'nfts.image', 'nfts.name', 'erc721_tokens.chainid', 'erc721_tokens.name', 'nfts.id');
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'NFTs',
                type: SuccessResponseTypes.array,
                data: result
            }
        }
        return res
    } catch (error: any) {
        console.log(error)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function deleteNFT(nft: Delete, getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
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
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'The NFT was successfully deleted',
                type: SuccessResponseTypes.nullType,
                data: null
            }
        }
        return res 
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}