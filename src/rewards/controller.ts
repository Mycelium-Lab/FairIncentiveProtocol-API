import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../company/controller";
import { DeleteReward, JWTPayload, TokenReward } from "../entities";
import { AddTokenRewardValidation, DeleteRewardValidation } from "../schemas";
import { addTokenReward, deleteTokenReward, getTokenRewards } from "./service";

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
                const tokenReward: TokenReward = req.body as TokenReward
                await AddTokenRewardValidation.validateAsync(tokenReward)
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
    )
}