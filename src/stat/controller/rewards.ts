import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { authorizationTokenDescription } from "../../response_description";
import { DateRange, Uuid, ErrorResponse, JWTPayload, SuccessResponse, UuidDateRange } from "../../entities";
import { prettyStatRewardsError } from "../../errors";
import { get24hCount, get24hCountErc20, get24hCountErc721, getDistribution, getErc721RewardsDistributionOneUser, getRewardEventsRange, getRewardEventsRangeErc20, getRewardEventsRangeErc20OneUser, getRewardEventsRangeErc721, getTotalCount, getTotalCountErc20Reward, getTotalCountErc721Reward, getTotalRewardsDistributionErc20, getTotalRewardsDistributionErc721, getUserCount, getUserCountErc20Reward, getUserCountErc721Reward } from "../service/rewards";
import { DateRangeValidation, UuidDateRangeValidation, UuidValidation } from "../../schemas";

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
                    $ref: 'Uuid'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const reward: Uuid = req.query as Uuid
                await UuidValidation.validateAsync(reward)
                const res: ErrorResponse | SuccessResponse = await getTotalCountErc20Reward({email: data?.email, phone: data?.phone, company_id: data?.company_id}, reward.id)
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
                    $ref: 'Uuid'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const reward: Uuid = req.query as Uuid
                await UuidValidation.validateAsync(reward)
                const res: ErrorResponse | SuccessResponse = await getTotalCountErc721Reward({email: data?.email, phone: data?.phone, company_id: data?.company_id}, reward.id)
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
        '/rewarded_users/erc20',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const reward: Uuid = req.query as Uuid
                await UuidValidation.validateAsync(reward)
                const res: ErrorResponse | SuccessResponse = await getUserCountErc20Reward({email: data?.email, phone: data?.phone, company_id: data?.company_id}, reward.id)
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
        '/rewarded_users/erc721',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const reward: Uuid = req.query as Uuid
                await UuidValidation.validateAsync(reward)
                const res: ErrorResponse | SuccessResponse = await getUserCountErc721Reward({email: data?.email, phone: data?.phone, company_id: data?.company_id}, reward.id)
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
        '/rewarded_24h/erc20',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const reward: Uuid = req.query as Uuid
                await UuidValidation.validateAsync(reward)
                const res: ErrorResponse | SuccessResponse = await get24hCountErc20({email: data?.email, phone: data?.phone, company_id: data?.company_id}, reward.id)
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
        '/rewarded_24h/erc721',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const reward: Uuid = req.query as Uuid
                await UuidValidation.validateAsync(reward)
                const res: ErrorResponse | SuccessResponse = await get24hCountErc721({email: data?.email, phone: data?.phone, company_id: data?.company_id}, reward.id)
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
        '/rewards_range/erc20',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const dateRange: UuidDateRange = req.query as UuidDateRange
                dateRange.startDate = new Date(dateRange.startDate)
                dateRange.endDate = new Date(dateRange.endDate)
                await UuidDateRangeValidation.validateAsync(dateRange)
                const res: ErrorResponse | SuccessResponse = await getRewardEventsRangeErc20({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
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
        '/rewards_range/erc721',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const dateRange: UuidDateRange = req.query as UuidDateRange
                dateRange.startDate = new Date(dateRange.startDate)
                dateRange.endDate = new Date(dateRange.endDate)
                await UuidDateRangeValidation.validateAsync(dateRange)
                const res: ErrorResponse | SuccessResponse = await getRewardEventsRangeErc721({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
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
        '/rewards_distribution/erc20',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const dateRange: UuidDateRange = req.query as UuidDateRange
                dateRange.startDate = new Date(dateRange.startDate)
                dateRange.endDate = new Date(dateRange.endDate)
                await UuidDateRangeValidation.validateAsync(dateRange)
                const res: ErrorResponse | SuccessResponse = await getTotalRewardsDistributionErc20({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
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
        '/rewards_distribution/erc721',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const dateRange: UuidDateRange = req.query as UuidDateRange
                dateRange.startDate = new Date(dateRange.startDate)
                dateRange.endDate = new Date(dateRange.endDate)
                await UuidDateRangeValidation.validateAsync(dateRange)
                const res: ErrorResponse | SuccessResponse = await getTotalRewardsDistributionErc721({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
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
        '/rewards_distribution/erc721/user',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const dateRange: UuidDateRange = req.query as UuidDateRange
                dateRange.startDate = new Date(dateRange.startDate)
                dateRange.endDate = new Date(dateRange.endDate)
                await UuidDateRangeValidation.validateAsync(dateRange)
                const res: ErrorResponse | SuccessResponse = await getErc721RewardsDistributionOneUser({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
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
        '/rewards_range/erc20/user',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const dateRange: UuidDateRange = req.query as UuidDateRange
                dateRange.startDate = new Date(dateRange.startDate)
                dateRange.endDate = new Date(dateRange.endDate)
                await UuidDateRangeValidation.validateAsync(dateRange)
                const res: ErrorResponse | SuccessResponse = await getRewardEventsRangeErc20OneUser({email: data?.email, phone: data?.phone, company_id: data?.company_id}, dateRange)
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