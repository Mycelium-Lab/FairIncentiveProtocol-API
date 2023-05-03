import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest, RouteShorthandOptions } from "fastify";

export async function jwtPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply) {
        try {
          await request.jwtVerify()
        } catch (err) {
          reply.send(err)
        }
    })
}