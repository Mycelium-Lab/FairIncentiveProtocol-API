import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { authPlugin } from './auth/controller'
import { jwtPlugin } from './auth/jwt'
import fastifyJwt from '@fastify/jwt'
import { config } from './config/config'
import { addSchemas } from './schemas'

export type AppOptions = Partial<FastifyServerOptions>

export async function build(opt: AppOptions = {}) {
    const app: FastifyInstance = Fastify(opt)  
    
    addSchemas(app)
    app.register(fastifyJwt, { secret: config.SECRET_KEY })
    app.register(jwtPlugin)
    app.register(authPlugin, { prefix: '/auth' })
    app.get('/ping', (req, res) => {res.send('pong')})
    return app
}
