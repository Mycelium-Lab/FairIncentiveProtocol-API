import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { authorizationTokenDescription } from "../../response_description";
import { DateRange, Delete, ErrorResponse, JWTPayload, SuccessResponse } from "../../entities";
import { prettyStatRewardsError } from "../../errors";
import { get24hCount, getDistribution, getRewardEventsRange, getTotalCount, getTotalCountErc20Reward, getTotalCountErc721Reward, getUserCount } from "../service/rewards";
import { DateRangeValidation } from "../../schemas";

export async function statRewardsController(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/total_rewards',
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
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/rewarded_users',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getUserCount({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/rewarded_24h',
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
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/rewards_distribution',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getDistribution({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/rewards_range',
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
                const res: ErrorResponse | SuccessResponse = await getRewardEventsRange({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/total_rewards/erc20',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'RewardOneStat'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const deleteReward: Delete = req.query as Delete
                const res: ErrorResponse | SuccessResponse = await getTotalCountErc20Reward({email: data?.email, phone: data?.phone, company_id: data?.company_id}, deleteReward.id)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/total_rewards/erc721',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'RewardOneStat'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const deleteReward: Delete = req.query as Delete
                const res: ErrorResponse | SuccessResponse = await getTotalCountErc721Reward({email: data?.email, phone: data?.phone, company_id: data?.company_id}, deleteReward.id)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}