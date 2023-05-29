import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { ErrorResponse, JWTPayload, SuccessResponse, Token } from "../entities";
import { AddTokenValidation } from "../schemas";
import { addToken, getTokens } from "./service";
import { prettyTokensError } from "../errors";

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
                    const res: ErrorResponse | SuccessResponse = await addToken(Token, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyTokensError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
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
                    const res: ErrorResponse | SuccessResponse = await getTokens({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyTokensError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}