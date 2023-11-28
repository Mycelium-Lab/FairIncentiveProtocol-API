import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ApiKey, ErrorResponse, GetCompany, JWTPayload } from "../entities";
import { prettyApiKeysError } from "../errors";
import { DeleteApiKeyValidation } from "../schemas";
import { createApiKey, deleteApiKey, getApiKeys } from "./service";

export async function apiKeysPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/', 
        {
            preHandler: app.authenticate
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res = await getApiKeys(data as GetCompany)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyApiKeysError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/create',
        {
            preHandler: app.authenticate
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const randomNumber = Math.random()
                const key = app.jwt.sign({...data, randomNumber})
                const res = await createApiKey(data as GetCompany, key)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyApiKeysError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/delete', 
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'DeleteApiKey' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const key: ApiKey = req.body as ApiKey
                await DeleteApiKeyValidation.validateAsync(key)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res = await deleteApiKey(data as GetCompany, key.key)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyApiKeysError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}