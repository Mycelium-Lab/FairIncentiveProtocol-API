import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { Delete, ErrorResponse, JWTPayload, SuccessResponse, UpdateUser, User } from "../entities";
import { AddUserValidation, DeleteValidation, UpdateUserValidation } from "../schemas";
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
                const file: any = await req.file()
                const user: User = {
                    external_id: file.fields.external_id.value,
                    email: file.fields.email.value,
                    wallet: file.fields.wallet.value,
                    notes: file.fields.notes.value,
                    properties: JSON.parse(file.fields.properties.value),
                    stats: JSON.parse(file.fields.stats.value)
                }
                await AddUserValidation.validateAsync(user)
                const _file = new File([await file.toBuffer()], file.filename, {type: file.mimetype})
                const storage = new NFTStorage({ token: config.NFT_STORAGE_KEY })
                const cid = await storage.store({
                    image: _file,
                    name: file.filename,
                    description: file.filename
                })
                const image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`
                user.image = image
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
                body: { $ref: 'Delete' },
                headers: authorizationTokenDescription,
                response: userDeleteResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: Delete = req.body as Delete
                await DeleteValidation.validateAsync(user)
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