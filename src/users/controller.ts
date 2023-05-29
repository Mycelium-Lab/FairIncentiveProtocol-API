import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { Delete, ErrorResponse, JWTPayload, SuccessResponse, UpdateUser, User } from "../entities";
import { AddUserValidation, DeleteValidation, UpdateUserValidation } from "../schemas";
import { getToken } from "../company/controller";
import { addUser, deleteUser, getUsers, updateUser } from "./service";
import { prettyUsersError } from "../errors";

export async function usersPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.post(
        '/add',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'AddUser' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: User = req.body as User
                await AddUserValidation.validateAsync(user)
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: ErrorResponse | SuccessResponse = await addUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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
    app.get(
        '/',
        {
            onRequest: [async (req) => await req.jwtVerify()],
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: ErrorResponse | SuccessResponse = await getUsers({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'Delete' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: Delete = req.body as Delete
                await DeleteValidation.validateAsync(user)
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: ErrorResponse | SuccessResponse = await deleteUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'UpdateUser' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: UpdateUser = req.body as UpdateUser
                await UpdateUserValidation.validateAsync(user)
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: ErrorResponse | SuccessResponse = await updateUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? {body: res.body} : {error: res.error})
                } else throw Error('Wrong auth token') 
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