import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { authPlugin } from './auth/controller'
import { jwtPlugin } from './auth/jwt'
import fastifyJwt from '@fastify/jwt'
import { config } from './config/config'
import { addSchemas } from './schemas'
import cors from '@fastify/cors'
import { companyPlugin } from './company/controller'
import { tokensPlugin } from './tokens/controller'
import { usersPlugin } from './users/controller'
import { nftsPlugin } from './nfts/controller'

export type AppOptions = Partial<FastifyServerOptions>

export async function build(opt: AppOptions = {}) {
    const app: FastifyInstance = Fastify(opt)  
    
    addSchemas(app)
    app.register(fastifyJwt, { 
        secret: config.SECRET_KEY,
        
    })
    app.register(jwtPlugin)
    app.register(authPlugin, { prefix: '/auth' })
    app.register(companyPlugin, { prefix: '/company' })
    app.register(tokensPlugin, { prefix: '/tokens' })
    app.register(usersPlugin, { prefix: '/users' })
    app.register(nftsPlugin, { prefix: '/nfts' })
    app.register(cors, {
        origin: "*",
        methods: ["GET", "POST"]
      });
    app.get('/ping', (req, res) => {res.send('pong')})

    return app
}
