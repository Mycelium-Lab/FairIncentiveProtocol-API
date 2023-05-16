import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { ClaimNFT, DeleteReward, JWTPayload, NFTReward, RewardNFTEvent, RewardTokenEvent, RewardWithToken, TokenReward, UpdateTokenReward } from "../entities";
import { AddNFTRewardValidation, AddTokenRewardValidation, DeleteRewardValidation, RewardWithTokenValidation } from "../schemas";
import { addNFTReward, addTokenReward, deleteNFTReward, deleteTokenReward, getClaimableNFT, getNFTRewards, getRewardNFTEvents, getRewardTokenEvents, getTokenRewards, rewardWithNFT, rewardWithToken, updateTokenReward } from "./service";

export async function rewardsPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.post(
        '/add/token',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'AddTokenReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const tokenReward: TokenReward = req.body as TokenReward
                await AddTokenRewardValidation.validateAsync(tokenReward)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const createdTokenReward = await addTokenReward(
                        {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                        tokenReward
                    )
                    reply
                        .code(createdTokenReward ? 200 : 500)
                        .send({createdTokenReward})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                console.log(error)
                reply
                    .code(500)
                    .send({createdTokenReward: null})
            }
        }
    ),
    app.get(
        '/get/token',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const tokenRewards: Array<TokenReward> = await getTokenRewards({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(tokenRewards.length ? 200 : 500)
                        .send({tokenRewards})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                reply
                    .code(500)
                    .send({tokenRewards: []})
            }
        }
    ),
    app.post(
        '/delete/token',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'DeleteReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const deleteReward: DeleteReward = req.body as DeleteReward
                await DeleteRewardValidation.validateAsync(deleteReward)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await deleteTokenReward(
                        {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                        deleteReward
                    )
                    reply
                        .code(res ? 200 : 500)
                        .send({message: 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                reply
                    .code(500)
                    .send({createdTokenReward: null})
            }
        }
    ),
    app.post(
        '/reward/token',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'RewardWithToken' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const reward: RewardWithToken = req.body as RewardWithToken
                await RewardWithTokenValidation.validateAsync(reward)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const rewarded = await rewardWithToken(
                        {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                        reward
                    )
                    reply
                        .code(rewarded ? 200 : 500)
                        .send({rewarded})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                console.log(error)
                reply
                    .code(500)
                    .send({rewarded: null})
            }
        }
    ),
    app.get(
        '/events/tokens',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const rewardEvents: Array<RewardTokenEvent> = await getRewardTokenEvents({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(200)
                        .send({rewardEvents})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                reply
                    .code(500)
                    .send({rewardEvents: []})
            }
        }
    )
    app.post(
        '/add/nft',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'AddNFTReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const nftReward: NFTReward = req.body as NFTReward
                await AddNFTRewardValidation.validateAsync(nftReward)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const createdNFTReward = await addNFTReward(
                        {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                        nftReward
                    )
                    reply
                        .code(createdNFTReward ? 200 : 500)
                        .send({createdNFTReward})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                console.log(error)
                reply
                    .code(500)
                    .send({createdTokenReward: null})
            }
        }
    )
    app.get(
        '/get/nfts',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const nftRewards: Array<NFTReward> = await getNFTRewards({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(nftRewards.length ? 200 : 500)
                        .send({nftRewards})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                reply
                    .code(500)
                    .send({nftRewards: []})
            }
        }
    )
    app.post(
        '/delete/nfts',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'DeleteReward' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const deleteReward: DeleteReward = req.body as DeleteReward
                await DeleteRewardValidation.validateAsync(deleteReward)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await deleteNFTReward(
                        {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                        deleteReward
                    )
                    reply
                        .code(res ? 200 : 500)
                        .send({message: 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                reply
                    .code(500)
                    .send({createdTokenReward: null})
            }
        }
    )
    app.post(
        '/reward/nft',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'RewardWithToken' }
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const reward: RewardWithToken = req.body as RewardWithToken
                await RewardWithTokenValidation.validateAsync(reward)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const rewarded = await rewardWithNFT(
                        {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                        reward
                    )
                    reply
                        .code(rewarded ? 200 : 500)
                        .send({rewarded})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                console.log(error)
                reply
                    .code(500)
                    .send({rewarded: null})
            }
        }
    )
    app.get(
        '/events/nfts',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const rewardEvents: Array<RewardNFTEvent> = await getRewardNFTEvents({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(200)
                        .send({rewardEvents})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                reply
                    .code(500)
                    .send({rewardEvents: []})
            }
        }
    )
    app.get(
        '/events/claimablenft',
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const query = req.query as any
                const claimableNFT: ClaimNFT | null = await getClaimableNFT(query.id, query.user_id)
                reply
                    .code(200)
                    .send({claimableNFT})
            } catch (error) {
                reply
                    .code(500)
                    .send({claimableNFT: null})
            }
        }
    )
    app.post(
        '/update/token',
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const update: UpdateTokenReward = req.body as UpdateTokenReward
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const done: boolean = await updateTokenReward(
                        {email: data?.email, phone: data?.phone, company_id: data?.company_id},
                        update
                    )
                    reply
                        .code(done ? 200 : 500)
                        .send({done})
                } else throw Error('Something wrong with token') 
            } catch (error) {
                reply
                    .code(500)
                    .send({done: false})
            }
        }
    )
}