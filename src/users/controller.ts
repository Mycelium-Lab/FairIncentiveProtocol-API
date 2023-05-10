import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { DeleteUser, JWTPayload, User } from "../entities";
import { AddUserValidation, DeleteUserValidation } from "../schemas";
import { getToken } from "../company/controller";
import { addUser, deleteUser, getUsers } from "./service";

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
                    const res: string | null = await addUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    console.log(res)
                    reply    
                        .code(res ? 200 : 500)
                        .send({id: res})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                reply
                    .code(500)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(
                        {
                            message: error.message
                        }
                    )
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
                    const users: Array<User> = await getUsers({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(200)
                        .send({users})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                reply
                    .code(500)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(
                        {
                            message: error.message
                        }
                    )
            }
        }
    ),
    app.post(
        '/delete',
        {
            onRequest: [async (req) => await req.jwtVerify()],
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const user: DeleteUser = req.body as DeleteUser
                await DeleteUserValidation.validateAsync(user)
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res: boolean = await deleteUser(user, {email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply    
                        .code(res ? 200 : 500)
                        .send({message: res ? 'Done' : 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                reply
                    .code(500)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(
                        {
                            message: error.message
                        }
                    )
            }
        }
    )
}