import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { authorizationTokenDescription } from "../../response_description";
import { DateRange, ErrorResponse, JWTPayload, SuccessResponse } from "../../entities";
import { prettyStatRewardsError } from "../../errors";
import { DateRangeValidation } from "../../schemas";
import { getTotalCount } from "../service/tokens";

export async function statTokensController(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.get(
        '/total_tokens',
        {
            preHandler: app.authenticate,
            schema: {
                headers: authorizationTokenDescription
            }  
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            try {
                const data: JWTPayload | undefined = req.routeConfig.jwtData
                const res: ErrorResponse | SuccessResponse = await getTotalCount({email: data?.email, phone: data?.phone, company_id: data?.company_id})
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? {body: res.body} : {error: res.error})
            } catch (error: any) {
                console.log(error.message)
                const prettyError: ErrorResponse = prettyStatRewardsError(error.message)
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({error: prettyError.error})
            }
        }
    )
}