import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { AuthServiceReply, ErrorResponse, JWTPayload, SignInCompany, SignUpCompany, SuccessResponse } from "../entities";
import { SignInValidation, SignUpValidation } from "../schemas";
import { checkCompany } from "./service";
import { createCompany } from "../company/service";
import { prettyAuthError } from "../errors";

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
            const res: ErrorResponse | SuccessResponse = await createCompany(body)
            reply
                .code(res.code)
                .type('application/json; charset=utf-8')
                .send('body' in res ? {body: res.body} : {error: res.error})
        } catch (error: any) {
            console.log(error.message)
            const prettyError: ErrorResponse = prettyAuthError(error.message)
            reply
                .code(prettyError.code)
                .type('application/json; charset=utf-8')
                .send({error: prettyError.error})
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
            const res = await checkCompany(body)
            //create token if OK
            if ('body' in res ) {
                const payload: JWTPayload = {email: body.email, company_id: res.body.data.company_id, company: true, address: res.body.data.address}
                res.body.data.token = app.jwt.sign(payload)
            }
            reply
                .code(res.code)
                .type('application/json; charset=utf-8')
                .send('body' in res ? {body: res.body} : {error: res.error})
        } catch (error: any) {
            console.log(error.message)
            const prettyError: ErrorResponse = prettyAuthError(error.message)
            reply
                .code(prettyError.code)
                .type('application/json; charset=utf-8')
                .send({error: prettyError.error})
        }
    })
}