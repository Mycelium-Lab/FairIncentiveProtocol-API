import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import fastifyStatic from '@fastify/static'
import path from 'path'

export async function publicPlugin(app: FastifyInstance, opt: FastifyPluginOptions) {
    app.register(fastifyStatic, {
        root: path.join(__dirname, '../../public')
    })
    app.get(
        '/nft',
        async (req: FastifyRequest, reply: FastifyReply) => {
            return reply.sendFile('claimnft.html')
        }
    )
    app.get(
        '/token',
        async (req: FastifyRequest, reply: FastifyReply) => {
            return reply.sendFile('claimtoken.html')
        }
    )
}