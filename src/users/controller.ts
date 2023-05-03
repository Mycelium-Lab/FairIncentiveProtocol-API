import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload, User } from "../entities";
import { AddUserValidation } from "../schemas";
import { getToken } from "../company/controller";
import { addUser } from "./service";

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
                    const res = await addUser(user, {email: data?.email, phone: data?.phone})
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