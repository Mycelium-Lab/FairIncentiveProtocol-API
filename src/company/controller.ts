import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { JWTPayload, ReplyCompany, UpdateEmail, UpdateName, UpdatePassword, UpdatePhone, UpdateWallet } from "../entities";
import { changeEmail, changeName, changePassword, changePhone, changeWallet, getCompany } from "./service";
import { ChangeCompanyEmailValidation, ChangeCompanyNameValidation, ChangeCompanyPasswordValidation, ChangeCompanyPhoneValidation, ChangeCompanyWalletValidation } from "../schemas";

export async function companyPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/', 
        {
            onRequest: [async (req) => await req.jwtVerify()]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const company: ReplyCompany = await getCompany({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                    reply
                        .code(200)
                        .send(company)
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
    app.post(
        '/changename',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'ChangeCompanyName' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const updateName: UpdateName = req.body as UpdateName
                await ChangeCompanyNameValidation.validateAsync(updateName)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await changeName({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updateName.newName)
                    reply
                        .code(res ? 200 : 500)
                        .send({message: res ? 'Done' : 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
    app.post(
        '/changeemail',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'ChangeCompanyEmail' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const updateEmail: UpdateEmail = req.body as UpdateEmail
                await ChangeCompanyEmailValidation.validateAsync(updateEmail)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await changeEmail({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updateEmail.newEmail)
                    reply
                        .code(res ? 200 : 500)
                        .send({message: res ? 'Done' : 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
    app.post(
        '/changephone',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'ChangeCompanyPhone' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const updatePhone: UpdatePhone = req.body as UpdatePhone
                await ChangeCompanyPhoneValidation.validateAsync(updatePhone)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await changePhone({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updatePhone.newPhone)
                    reply
                        .code(res ? 200 : 500)
                        .send({message: res ? 'Done' : 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
    app.post(
        '/changewallet',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'ChangeCompanyWallet' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const updateWallet: UpdateWallet = req.body as UpdateWallet
                await ChangeCompanyWalletValidation.validateAsync(updateWallet)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await changeWallet({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updateWallet.newWallet)
                    reply
                        .code(res ? 200 : 500)
                        .send({message: res ? 'Done' : 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
    app.post(
        '/changepassword',
        {
            onRequest: [async (req) => await req.jwtVerify()],
            schema: { 
                body: { $ref: 'ChangeCompanyPassword' } 
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = getToken(req)
                const updatePassword: UpdatePassword = req.body as UpdatePassword
                await ChangeCompanyPasswordValidation.validateAsync(updatePassword)
                if (token) {
                    const data: JWTPayload | null = app.jwt.decode(token)
                    const res = await changePassword({email: data?.email, phone: data?.phone, company_id: data?.company_id}, updatePassword.newPassword)
                    reply
                        .code(res ? 200 : 500)
                        .send({message: res ? 'Done' : 'Something went wrong'})
                } else throw Error('Something wrong with token') 
            } catch (error: any) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({message: error.message})
            }
        }
    )
}

export function getToken(req: FastifyRequest): string | undefined {
    const headers = req.headers['authorization']
    const token = headers?.split(' ')[1]
    return token 
}