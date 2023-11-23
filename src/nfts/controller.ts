import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { AddNFT, AddNFTCollection, Delete, ErrorResponse, GetOneCollectionNft, JWTPayload, NFTCollection, SuccessResponse } from "../entities";
import { AddNFTCollectionValidation, AddNFTValidation, AddTokenValidation, DeleteValidation } from "../schemas";
import { addNFT, addNFTCollection, deleteNFT, getNFTCollections, getNFTs, getNFTsOneCollection } from "./service";
import { CODES, CODES_RANGES } from "../utils/constants";
import { prettyNFTError } from "../errors";
import { authorizationTokenDescription, collectionAddResponseDescription, nftAddResponseDescription, nftCollectionsResponseDescription, nftsDeleteResponseDescription, nftsResponseDescription } from "../response_description";
import { File, NFTStorage } from "nft.storage";
import { config } from "../config/config";

export async function nftsPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/collections',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                response: nftCollectionsResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getNFTCollections({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyNFTError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/nfts',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                response: nftsResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res = await getNFTs({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error)
                const prettyError: ErrorResponse = prettyNFTError(error.message)
                reply
                    .code(prettyError.code)
                    .send({error: prettyError.error})
            }
        }
    ),
    app.get(
        '/nfts/one',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'GetOneCollectionNft'
                }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const getOneCollectionNft: GetOneCollectionNft = req.query as GetOneCollectionNft
                const res = await getNFTsOneCollection({email: data?.email, phone: data?.phone, company_id: data?.company_id}, getOneCollectionNft)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error)
                const prettyError: ErrorResponse = prettyNFTError(error.message)
                reply
                    .code(prettyError.code)
                    .send({error: prettyError.error})
            }
        }
    ),
    app.post(
        '/add/collection',
        {
            preHandler: app.authenticate,
            schema: { 
                // body: { $ref: 'AddNFTCollection' },
                headers: authorizationTokenDescription,
                response: collectionAddResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const body: any = req.body
                let logoImage, featuredImage, bannerImage
                let nft: any = {
                    address: body.address.value,
                    name: body.name.value,
                    symbol: body.symbol.value,
                    chainid: body.chainid.value,
                    description: body.description.value === 'null' ? null : body.description.value,
                    links: JSON.parse(body.links.value),
                    beneficiary: body.beneficiary.value === 'null' ? null : body.beneficiary.value,
                    royalties: body.royalties.value
                }
                if (!body.logo_image) throw Error('Logo image cannot be null')
                else logoImage = new File([await body.logo_image.toBuffer()], body.logo_image.filename, {type: body.logo_image.mimetype})
                
                if (!body.featured_image) throw Error('Featured image cannot be null')
                else featuredImage = new File([await body.featured_image.toBuffer()], body.featured_image.filename, {type: body.featured_image.mimetype})

                if (!body.banner_image) throw Error('Banner image cannot be null')
                else bannerImage = new File([await body.banner_image.toBuffer()], body.banner_image.filename, {type: body.banner_image.mimetype})

                await AddNFTCollectionValidation.validateAsync(nft)
                const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
                //@ts-ignore
                const cid = await storage.storeDirectory([
                    logoImage, featuredImage, bannerImage
                ])
                nft.logo_image = `https://ipfs.io/ipfs/${cid}/${logoImage?.name}`
                nft.featured_image = `https://ipfs.io/ipfs/${cid}/${featuredImage?.name}`
                nft.banner_image = `https://ipfs.io/ipfs/${cid}/${bannerImage?.name}`
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await addNFTCollection(nft, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyNFTError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/add/nft',
        {
            preHandler: app.authenticate,
            schema: { 
                // body: { $ref: 'AddNFT' },
                headers: authorizationTokenDescription,
                response: nftAddResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const body: any = req.body
                const nft: AddNFT = {
                    address: body.address.value,
                    chainid: body.chainid.value,
                    amount: body.amount.value === 'null' ? null : body.amount.value,
                    name: body.name.value,
                    description: body.description.value === 'null' ? null : body.description.value
                }
                await AddNFTValidation.validateAsync(nft)
                let _file;
                if (!body.image) throw Error('NFT image cannot be null')
                else _file = new File([await body.image.toBuffer()], body.image.filename, {type: body.image.mimetype})
            
                const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
                const cid = await storage.store({
                    image: _file,
                    name: body.image.filename,
                    description: body.image.filename
                })
                const image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`
                nft.image = image
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await addNFT(nft, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error)
                const prettyError: ErrorResponse = prettyNFTError(error.message)
                reply
                    .code(prettyError.code)
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/delete/nft',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'Delete' },
                headers: authorizationTokenDescription,
                response: nftsDeleteResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const nft: Delete = req.body as Delete
                await DeleteValidation.validateAsync(nft)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res = await deleteNFT(nft, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error)
                const prettyError: ErrorResponse = prettyNFTError(error.message)
                reply
                    .code(prettyError.code)
                    .send({error: prettyError.error})
            }
        }
    )
}