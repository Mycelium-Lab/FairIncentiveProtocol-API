import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { config } from './config/config'
import { addSchemas } from './schemas'
import { companyPlugin } from './company/controller'
import { tokensPlugin } from './tokens/controller'
import { usersPlugin } from './users/controller'
import { nftsPlugin } from './nfts/controller'
import { rewardsPlugin } from './rewards/controller'
import { authPlugin } from './auth/controller'
import { jwtPlugin } from './auth/jwt'
import { publicPlugin } from './public/controller'
import { CODES_RANGES } from './utils/constants'

export type AppOptions = Partial<FastifyServerOptions>

export async function build(opt: AppOptions = {}) {
    const app: FastifyInstance = Fastify(opt)  
    
    addSchemas(app)
    app.register(fastifyJwt, { 
        secret: config.SECRET_KEY,
        sign: {
            expiresIn: '1h'
        }
    })
    app.register(jwtPlugin)
    app.register(authPlugin, { prefix: '/auth' })
    app.register(companyPlugin, { prefix: '/company' })
    app.register(tokensPlugin, { prefix: '/tokens' })
    app.register(usersPlugin, { prefix: '/users' })
    app.register(nftsPlugin, { prefix: '/nfts' })
    app.register(rewardsPlugin, { prefix: '/rewards' })
    app.register(publicPlugin, { prefix: '/claim' })
    app.register(cors, {
        origin: "*",
        methods: ["GET", "POST"]
      })
    app.get('/ping', (req, res) => res.send('pong'))
    app.setErrorHandler((error, request, reply) => {
        if (error.statusCode === 400) error.name = 'Bad Request'
        error.message = 
            error.message.includes(' must') 
            ? 
            error.message.replace('body/', '<').replace(' must', '> must')
            :
            error.message
        const customError = {
          error: {
            name: error.name || 'Internal Server Error',
            message: error.message || 'An error occurred',
          },
        }
      
        reply
            .code(error.statusCode || 500)
            .send(customError)
            .type('application/json; charset=utf-8')
    });

    return app
}
