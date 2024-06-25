import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { Company, ErrorResponse, ForgotPassEmail, JWTPayload, SuccessResponse } from "../entities";
import { checkCompanyOnThisEmailExist } from "./service";
import { prettyPassResetError } from "../errors";
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { config } from "../config/config";
import { CODES, SuccessResponseTypes } from "../utils/constants";
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: config.MAILGUN_API_KEY});

export async function passResetPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.post('/forgot', 
        {
            schema: {
                body: { $ref: 'ForgotPassEmail' },
            }
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const body: ForgotPassEmail = req.body as ForgotPassEmail
                const companyChecker: Company | undefined = await checkCompanyOnThisEmailExist(body.email)
                if (!companyChecker) {
                    const res: ErrorResponse = prettyPassResetError('Company with this email does not exist')
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send({error: res.error})
                } else {
                    const jwtPayload: JWTPayload = {email: body.email, company_id: companyChecker.id, company: true, address: companyChecker.wallet}
                    const signatureForReset = app.jwt.sign(jwtPayload, { expiresIn: '1h' })
                    await mg.messages.create('sandbox0deba8e9ece34f7b9226a60bb58ab4a6.mailgun.org', {
                        from: "Excited User <mailgun@sandbox0deba8e9ece34f7b9226a60bb58ab4a6.mailgun.org>",
                        to: [body.email],
                        subject: "Password Recovery",
                        text: "Password Recovery",
                        html: `<h1>${signatureForReset}</h1>`
                    })
                    const res: SuccessResponse = {
                        code: CODES.OK.code,
                        body: {
                            message: 'The email was successfully sent',
                            type: SuccessResponseTypes.string
                        }
                    }
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send({body: res.body})
                }
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyPassResetError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}