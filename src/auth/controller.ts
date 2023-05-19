import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { AuthServiceReply, JWTPayload, SignInCompany, SignUpCompany } from "../entities";
import { SignInValidation, SignUpValidation } from "../schemas";
import { checkCompany } from "./service";
import { createCompany } from "../company/service";

export async function authPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.post(
        '/signup', 
        {
            schema: { 
                body: { $ref: 'SignUpCompany' } 
            }
        }, 
        async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const body: SignUpCompany = req.body as SignUpCompany
            await SignUpValidation.validateAsync(body)
            const serviceReply: AuthServiceReply = await createCompany(body)
            reply   
                .code(serviceReply.code)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(serviceReply.res)
        } catch (error: any) {
            //TODO: use pretty authError
            if (error.message.includes('repeat_password')) {
                error.message = 'Repeated password is incorrect (repeat_password)'
            }
            reply
                .code(400)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(
                    {
                        message: error.message
                    }
                )
        }
    }),
    app.post(
        '/signin', 
        {
            schema: { 
                body: { $ref: 'SignInCompany' } 
            }
        }, 
        async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const body: SignInCompany = req.body as SignInCompany
            await SignInValidation.validateAsync(body)
            const serviceReply: AuthServiceReply = await checkCompany(body)
            //create token if OK
            const payload: JWTPayload = {email: body.email, phone: body.phone, company_id: serviceReply.data.company_id, company: true, address: serviceReply.data.address}
            if (!serviceReply.isError) serviceReply.res.message = app.jwt.sign(payload)
            reply   
                .code(serviceReply.code)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(serviceReply.res)
        } catch (error: any) {
            //TODO: use pretty authError
            reply
                .code(400)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(
                    {
                        message: error.message
                    }
                )
        }
    })
}