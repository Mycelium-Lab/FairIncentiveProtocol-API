import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ErrorResponse, JWTPayload, SuccessResponse, Token } from "../entities";
import { AddTokenValidation } from "../schemas";
import { addToken, getTokens } from "./service";
import { prettyTokensError } from "../errors";
import { authorizationTokenDescription, tokenAddResponseDescription, tokenResponseDescription } from "../response_description";
import { NFTStorage, File } from "nft.storage";
import { config } from "../config/config";

export async function tokensPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                response: tokenResponseDescription
            }
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
    app.post(
        '/add',
        {
            preHandler: app.authenticate,
            schema: { 
                // body: { $ref: 'AddToken' },
                headers: authorizationTokenDescription,
                response: tokenAddResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const body: any = req.body
                const token: Token = {
                    name: body.name.value,
                    symbol: body.symbol.value,
                    supply_type: body.supply_type.value,
                    chainid: body.chainid.value,
                    address: body.address.value,
                    max_supply: body.max_supply.value === 'null' ? null : body.max_supply.value,
                    initial_supply: body.initial_supply.value === 'null' ? null : body.initial_supply.value,
                    pausable: body.pausable.value,
                    burnable: body.burnable.value,
                    blacklist: body.blacklist.value,
                    recoverable: body.recoverable.value,
                    verified: body.verified.value,
                    fpmanager: body.fpmanager.value
                }
                await AddTokenValidation.validateAsync(token)
                const _file = new File([await body.image.toBuffer()], body.image.filename, {type: body.image.mimetype})
                const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
                const cid = await storage.store({
                    image: _file,
                    name: token.symbol,
                    description: token.name
                })
                const image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`
                token.image = image
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await addToken(token, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
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