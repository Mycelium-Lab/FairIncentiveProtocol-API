import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { ClaimNFT, ClaimToken, Uuid, ErrorResponse, JWTPayload, NFTReward, RewardNFTEvent, RewardTokenEvent, RewardWithToken, Status, SuccessResponse, TokenReward, UpdateNFTReward, UpdateTokenReward } from "../entities";
import { AddNFTRewardValidation, AddTokenRewardValidation, UuidValidation, RewardWithTokenValidation, StatusValidation, UpdateNFTRewardValidation, UpdateTokenRewardValidation } from "../schemas";
import { addNFTReward, addTokenReward, deleteNFTReward, deleteTokenReward, getClaimableNFT, getNFTRewards, getRewardNFTEvents, getRewardTokenEvents, getTokenRewards, rewardWithNFT, rewardWithToken, updateNFTReward, updateTokenReward, deleteTokenRewardEvent, deleteNFTRewardEvent, getClaimableToken, setTokenRewardStatus, setNFTRewardStatus } from "./service";
import { prettyRewardsError } from "../errors";

export async function rewardsPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/get/token',
        {
            preHandler: app.authenticate,
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getTokenRewards({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    ),
    app.get(
        '/get/nfts',
        {
            preHandler: app.authenticate,
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getNFTRewards({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/events/nfts',
        {
            preHandler: app.authenticate,
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getRewardNFTEvents({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/events/claimabletoken',
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const query = req.query as any
                const res: ErrorResponse | SuccessResponse = await getClaimableToken(query.id, query.user_id)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/events/claimablenft',
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const query = req.query as any
                const res: ErrorResponse | SuccessResponse = await getClaimableNFT(query.id, query.user_id)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.get(
        '/events/tokens',
        {
            preHandler: app.authenticate,
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getRewardTokenEvents({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/add/token',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'AddTokenReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const tokenReward: TokenReward = req.body as TokenReward
                await AddTokenRewardValidation.validateAsync(tokenReward)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await addTokenReward(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    tokenReward
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    ),
    app.post(
        '/delete/token',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'Uuid' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const Delete: Uuid = req.body as Uuid
                await UuidValidation.validateAsync(Delete)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await deleteTokenReward(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    Delete
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    ),
    app.post(
        '/reward/token',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'RewardWithToken' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const reward: RewardWithToken = req.body as RewardWithToken
                await RewardWithTokenValidation.validateAsync(reward)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await rewardWithToken(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    reward
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    ),
    app.post(
        '/add/nft',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'AddNFTReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const nftReward: NFTReward = req.body as NFTReward
                await AddNFTRewardValidation.validateAsync(nftReward)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await addNFTReward(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    nftReward
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/delete/nfts',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'Uuid' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const Delete: Uuid = req.body as Uuid
                await UuidValidation.validateAsync(Delete)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await deleteNFTReward(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    Delete
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/reward/nft',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'RewardWithToken' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const reward: RewardWithToken = req.body as RewardWithToken
                await RewardWithTokenValidation.validateAsync(reward)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await rewardWithNFT(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    reward
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/update/token',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'UpdateTokenReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const update: UpdateTokenReward = req.body as UpdateTokenReward
                await UpdateTokenRewardValidation.validateAsync(update)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await updateTokenReward(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    update
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/update/nft',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'UpdateNFTReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const update: UpdateNFTReward = req.body as UpdateNFTReward
                await UpdateNFTRewardValidation.validateAsync(update)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await updateNFTReward(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    update
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/update/status/token',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'Status' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const status: Status = req.body as Status
                await StatusValidation.validateAsync(status)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await setTokenRewardStatus(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    status
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/update/status/nft',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'Status' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const status: Status = req.body as Status
                await StatusValidation.validateAsync(status)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await setNFTRewardStatus(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    status
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/delete/events/token',
        {
            preHandler: app.authenticate,
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const tokenRewardEvent: Uuid = req.body as Uuid
                await UuidValidation.validateAsync(tokenRewardEvent)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await deleteTokenRewardEvent(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    tokenRewardEvent
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/delete/events/nft',
        {
            preHandler: app.authenticate,
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const nftRewardEvent: Uuid = req.body as Uuid
                await UuidValidation.validateAsync(nftRewardEvent)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await deleteNFTRewardEvent(
                    {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                    nftRewardEvent
                )
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}