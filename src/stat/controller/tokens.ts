import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { authorizationTokenDescription } from "../../response_description";
import { DateRange, ErrorResponse, JWTPayload, SuccessResponse, TokenForDist } from "../../entities";
import { prettyStatTokensError } from "../../errors";
import { DateRangeValidation, TokenForDistValidation } from "../../schemas";
import { getCount24h, getOneTokenDistRange, getTokensDistRange, getTotalCount } from "../service/tokens";

export async function statTokensController(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/total_tokens',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getTotalCount({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatTokensError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/total_tokens_24h',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getCount24h({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatTokensError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/tokens_dist_range',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'DateRange'
                }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const dateRange: DateRange = req.query as DateRange
                dateRange.startDate = new Date(dateRange.startDate)
                dateRange.endDate = new Date(dateRange.endDate)
                await DateRangeValidation.validateAsync(dateRange)
                const res: ErrorResponse | SuccessResponse = await getTokensDistRange({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatTokensError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/one_token_dist_range',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'TokenForDist'
                }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const tokenForDist: TokenForDist = req.query as TokenForDist
                tokenForDist.startDate = new Date(tokenForDist.startDate)
                tokenForDist.endDate = new Date(tokenForDist.endDate)
                await TokenForDistValidation.validateAsync(tokenForDist)
                const res: ErrorResponse | SuccessResponse = await getOneTokenDistRange({email: data?.email, phone: data?.phone, company_id: data?.company_id}, tokenForDist)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatTokensError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}