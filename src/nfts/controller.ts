import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { AddNFT, AddNFTCollection, Delete, ErrorResponse, JWTPayload, NFTCollection, SuccessResponse } from "../entities";
import { AddNFTCollectionValidation, AddNFTValidation, AddTokenValidation, DeleteValidation } from "../schemas";
import { addNFT, addNFTCollection, deleteNFT, getNFTCollections, getNFTs } from "./service";
import { CODES, CODES_RANGES } from "../utils/constants";
import { prettyNFTError } from "../errors";

export async function nftsPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.post(
        '/add/collection',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'AddNFTCollection' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const nft: AddNFTCollection = req.body as AddNFTCollection
                await AddNFTCollectionValidation.validateAsync(nft)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: ErrorResponse | SuccessResponse = await addNFTCollection(nft, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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
        '/collections',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: ErrorResponse | SuccessResponse = await getNFTCollections({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'AddNFT' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const nft: AddNFT = req.body as AddNFT
                await AddNFTValidation.validateAsync(nft)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: ErrorResponse | SuccessResponse = await addNFT(nft, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
            } catch (error: any) {
                console.log(error)
                const prettyError: ErrorResponse = prettyNFTError(error.message)
                reply
                    .code(prettyError.code)
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/nfts',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await getNFTs({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'Delete' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const nft: Delete = req.body as Delete
                await DeleteValidation.validateAsync(nft)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await deleteNFT(nft, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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