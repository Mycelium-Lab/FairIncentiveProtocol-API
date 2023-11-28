import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ErrorResponse, JWTPayload, SuccessResponse, UpdateUser, User, Uuid } from "../entities";
import { AddUserValidation, UuidValidation, UpdateUserValidation } from "../schemas";
import { addUser, deleteUser, getUsers, updateUser } from "./service";
import { prettyUsersError } from "../errors";
import { authorizationTokenDescription, userAddResponseDescription, userDeleteResponseDescription, userUpdateResponseDescription, usersResponseDescription } from "../response_description";
import { File, NFTStorage } from "nft.storage";
import { config } from "../config/config";

export async function usersPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                response: usersResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getUsers({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyUsersError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    ),
    app.post(
        '/add',
        {
            preHandler: app.authenticate,
            schema: { 
                // body: { $ref: 'AddUser' },
                headers: authorizationTokenDescription,
                response: userAddResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const body: any = req.body
                let user: User = {
                    external_id: body.external_id.value,
                    email: body.email.value,
                    wallet: body.wallet.value,
                    notes: body.notes.value === 'null' ? null : body.notes.value,
                    properties: JSON.parse(body.properties.value),
                    stats: JSON.parse(body.stats.value)
                }
                await AddUserValidation.validateAsync(user)
                if (body.image) {
                    const image = new File([await body.image.toBuffer()], body.image.filename, {type: body.image.mimetype})
                    const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
                    const cid = await storage.store({
                        image: image,
                        name: image.name,
                        description: image.name
                    })
                    const _image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`
                    user.image = _image
                }
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await addUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyUsersError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    ),
    app.post(
        '/delete',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'Uuid' },
                headers: authorizationTokenDescription,
                response: userDeleteResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: Uuid = req.body as Uuid
                await UuidValidation.validateAsync(user)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await deleteUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyUsersError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/update',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'UpdateUser' },
                headers: authorizationTokenDescription,
                response: userUpdateResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: UpdateUser = req.body as UpdateUser
                await UpdateUserValidation.validateAsync(user)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await updateUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyUsersError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}