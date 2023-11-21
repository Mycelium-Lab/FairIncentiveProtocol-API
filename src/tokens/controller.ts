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
                const file: any = await req.file()
                const token: Token = {
                    name: file.fields.name.value,
                    symbol: file.fields.symbol.value,
                    supply_type: file.fields.supply_type.value,
                    chainid: file.fields.chainid.value,
                    address: file.fields.address.value,
                    max_supply: file.fields.max_supply.value === 'null' ? null : file.fields.max_supply.value,
                    initial_supply: file.fields.initial_supply.value === 'null' ? null : file.fields.initial_supply.value,
                    pausable: file.fields.pausable.value,
                    burnable: file.fields.burnable.value,
                    blacklist: file.fields.blacklist.value,
                    recoverable: file.fields.recoverable.value,
                    verified: file.fields.verified.value,
                    fpmanager: file.fields.fpmanager.value
                }
                await AddTokenValidation.validateAsync(token)
                const _file = new File([await file.toBuffer()], file.filename, {type: file.mimetype})
                const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
                const cid = await storage.store({
                    image: _file,
                    name: file.filename,
                    description: file.filename
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