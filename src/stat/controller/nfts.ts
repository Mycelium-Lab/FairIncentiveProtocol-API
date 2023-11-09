import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { authorizationTokenDescription } from "../../response_description";
import { DateRange, ErrorResponse, JWTPayload, SuccessResponse } from "../../entities";
import { prettyStatNftsError } from "../../errors";
import { DateRangeValidation } from "../../schemas";
import { get24hCount, getNftsDistRange, getTotalCount } from "../service/nfts";

export async function statNftsController(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/total_nfts',
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
                const prettyError: ErrorResponse = prettyStatNftsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/total_nfts_24h',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await get24hCount({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatNftsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/nfts_dist_range',
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
                const res: ErrorResponse | SuccessResponse = await getNftsDistRange({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatNftsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}