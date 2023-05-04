import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { AddNFT, AddToken, JWTPayload } from "../entities";
import { AddNFTValidation, AddTokenValidation } from "../schemas";
import { addNFT, getNFTs } from "./service";

export async function nftsPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.post(
        '/add',
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
                    const res = await addNFT(nft, {email: data?.email, phone: data?.phone})
                    reply
                        .code(res ? 200 : 500)
                        .send({message: res ? 'Done' : 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty tokens error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
    app.get(
        '/',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await getNFTs({email: data?.email, phone: data?.phone})
                    reply
                        .code(200)
                        .send({nfts: res})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty tokens error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
}