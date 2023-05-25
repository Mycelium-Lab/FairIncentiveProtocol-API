import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { JWTPayload, Token } from "../entities";
import { AddTokenValidation } from "../schemas";
import { addToken, getTokens } from "./service";

export async function tokensPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.post(
        '/add',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'AddToken' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const Token: Token = req.body as Token
                await AddTokenValidation.validateAsync(Token)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: Token | null = await addToken(Token, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res ? 200 : 500)
                        .send({token: res})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                console.log(error)
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
                    const res = await getTokens({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(200)
                        .send({tokens: res})
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