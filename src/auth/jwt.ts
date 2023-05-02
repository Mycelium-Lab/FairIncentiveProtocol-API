import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export async function jwtPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await req.jwtVerify()
        } catch (error) {
            reply.send(error)
        }
})}