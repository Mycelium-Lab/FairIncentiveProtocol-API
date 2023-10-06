import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ErrorResponse, JWTPayload, ReplyCompany, SuccessResponse, UpdateEmail, UpdateName, UpdatePassword, UpdatePhone, UpdateWallet } from "../entities";
import { changeEmail, changeName, changePassword, changePhone, changeWallet, getCompany } from "./service";
import { ChangeCompanyEmailValidation, ChangeCompanyNameValidation, ChangeCompanyPasswordValidation, ChangeCompanyPhoneValidation, ChangeCompanyWalletValidation } from "../schemas";
import { prettyCompanyError } from "../errors";
import { authorizationTokenDescription, changeEmailResponseDescription, changeNameResponseDescription, changePasswordResponseDescription, changePhoneResponseDescription, changeWalletResponseDescription, companyResponseDescription } from "../response_description";

export async function companyPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/', 
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription,
                response: companyResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getCompany({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyCompanyError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/changename',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'ChangeCompanyName' },
                headers: authorizationTokenDescription,
                response: changeNameResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const updateName: UpdateName = req.body as UpdateName
                await ChangeCompanyNameValidation.validateAsync(updateName)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await changeName({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updateName.newName)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyCompanyError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/changeemail',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'ChangeCompanyEmail' },
                headers: authorizationTokenDescription,
                response: changeEmailResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const updateEmail: UpdateEmail = req.body as UpdateEmail
                await ChangeCompanyEmailValidation.validateAsync(updateEmail)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await changeEmail({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updateEmail.newEmail)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyCompanyError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/changephone',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'ChangeCompanyPhone' },
                headers: authorizationTokenDescription,
                response: changePhoneResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const updatePhone: UpdatePhone = req.body as UpdatePhone
                await ChangeCompanyPhoneValidation.validateAsync(updatePhone)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await changePhone({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updatePhone.newPhone)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyCompanyError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/changewallet',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'ChangeCompanyWallet' },
                headers: authorizationTokenDescription,
                response: changeWalletResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const updateWallet: UpdateWallet = req.body as UpdateWallet
                await ChangeCompanyWalletValidation.validateAsync(updateWallet)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await changeWallet({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updateWallet.newWallet)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyCompanyError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
    app.post(
        '/changepassword',
        {
            preHandler: app.authenticate,
            schema: { 
                body: { $ref: 'ChangeCompanyPassword' },
                headers: authorizationTokenDescription,
                response: changePasswordResponseDescription
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const updatePassword: UpdatePassword = req.body as UpdatePassword
                await ChangeCompanyPasswordValidation.validateAsync(updatePassword)
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await changePassword({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updatePassword.newPassword)
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyCompanyError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}

export function getToken(req: FastifyRequest): string | undefined {
    const headers = req.headers['authorization']
    const token = headers?.split(' ')[1]
    return token 
}