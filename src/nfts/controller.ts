import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { AddNFT, AddNFTCollection, Delete, ErrorResponse, JWTPayload, NFTCollection, SuccessResponse } from "../entities";
import { AddNFTCollectionValidation, AddNFTValidation, AddTokenValidation, DeleteValidation } from "../schemas";
import { addNFT, addNFTCollection, deleteNFT, getNFTCollections, getNFTs } from "./service";
import { CODES, CODES_RANGES } from "../utils/constants";
import { prettyNFTError } from "../errors";

export async function nftsPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/collections',
        {
            preHandler: app.authenticate,
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
                body: { $ref: 'AddNFTCollection' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const nft: AddNFTCollection = req.body as AddNFTCollection
                await AddNFTCollectionValidation.validateAsync(nft)
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
                body: { $ref: 'AddNFT' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const nft: AddNFT = req.body as AddNFT
                await AddNFTValidation.validateAsync(nft)
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
                body: { $ref: 'Delete' }
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