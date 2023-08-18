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
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'AddToken' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const Token: Token = req.body as Token
                await AddTokenValidation.validateAsync(Token)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await addToken(Token, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
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
            preHandler: app.authenticate,
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getTokens({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
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