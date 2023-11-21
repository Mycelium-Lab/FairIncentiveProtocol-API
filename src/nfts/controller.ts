import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { AddNFT, AddNFTCollection, Delete, ErrorResponse, JWTPayload, NFTCollection, SuccessResponse } from "../entities";
import { AddNFTCollectionValidation, AddNFTValidation, AddTokenValidation, DeleteValidation } from "../schemas";
import { addNFT, addNFTCollection, deleteNFT, getNFTCollections, getNFTs } from "./service";
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
                // const file: any = await req.file()
                const parts: any = req.parts()
                let logoImage, featuredImage, bannerImage
                let nft: any = {}
                for await (const part of parts) {
                    if (part.fieldname === 'address') {
                        nft.address = part.value
                    }
                    if (part.fieldname === 'name') {
                        nft.name = part.value
                    }
                    if (part.fieldname === 'symbol') {
                        nft.symbol = part.value
                    }
                    if (part.fieldname === 'chainid') {
                        nft.chainid = part.value
                    }
                    if (part.fieldname === 'description') {
                        nft.description = part.value === 'null' ? null : part.value
                    }
                    if (part.fieldname === 'links') {
                        nft.links = JSON.parse(part.value)
                    }
                    if (part.fieldname === 'beneficiary') {
                        nft.beneficiary = part.value === 'null' ? null : part.value
                    }
                    if (part.fieldname === 'royalties') {
                        nft.royalties = part.value
                    }
                    if (part.fieldname === 'logo_image') {
                        logoImage = new File([await part.toBuffer()], part.filename, {type: part.mimetype})
                    }
                    if (part.fieldname === 'featured_image') {
                        featuredImage = new File([await part.toBuffer()], part.filename, {type: part.mimetype})
                    }
                    if (part.fieldname === 'banner_image') {
                        bannerImage = new File([await part.toBuffer()], part.filename, {type: part.mimetype})
                    }
                }
                await AddNFTCollectionValidation.validateAsync(nft)
                const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
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
                const file: any = await req.file()
                const nft: AddNFT = {
                    address: file.fields.address.value,
                    chainid: file.fields.chainid.value,
                    amount: file.fields.amount.value === 'null' ? null : file.fields.amount.value,
                    name: file.fields.name.value,
                    description: file.fields.description.value === 'null' ? null : file.fields.description.value
                }
                await AddNFTValidation.validateAsync(nft)
                const _file = new File([await file.toBuffer()], file.filename, {type: file.mimetype})
                const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
                const cid = await storage.store({
                    image: _file,
                    name: file.filename,
                    description: file.filename
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