import Fastify, { FastifyInstance, FastifyReply, FastifyServerOptions } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { config } from './config/config'
import { addSchemas } from './schemas'
import { companyPlugin } from './company/controller'
import { tokensPlugin } from './tokens/controller'
import { usersPlugin } from './users/controller'
import { nftsPlugin } from './nfts/controller'
import { rewardsPlugin } from './rewards/controller'
import { authPlugin } from './auth/controller'
import { publicPlugin } from './public/controller'
import { ErrorResponse, JWTPayload } from './entities'
import { CODES } from './utils/constants'
import { prettyAuthError } from './errors'
import { apiKeysPlugin } from './api_keys/controller'
import { checkApiKey } from './api_keys/service'

export type AppOptions = Partial<FastifyServerOptions>

export async function build(opt: AppOptions = {}) {
    const app: FastifyInstance = Fastify(opt)  
    
    addSchemas(app)
    app.register(fastifyJwt, { 
        secret: config.SECRET_KEY
    })
    app.register(swagger, {
      swagger: {
        info: {
          title: 'Fair Protocol API',
          description: 'Fair Protocol API',
          version: '0.1.0'
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here'
        },
        host: 'kongam.space',
        schemes: ['https'],
      }
    })
    app.decorate("authenticate", async function(request: any, reply: FastifyReply): Promise<void> {
      try {
        await request.jwtVerify()
        const token = request.headers.authorization?.split(' ')[1] 
        if (token) {
            const data: JWTPayload | null = app.jwt.decode(token)
            if (data?.randomNumber) {
              const check = await checkApiKey(token)
              if (check.code !== CODES.OK.code) throw Error("Wrong auth token, maybe it's deprecated or deleted") 
            }
            request.routeConfig.jwtData = data
        } else {
            throw new Error('Wrong auth token')
        }
      } catch (err: any) {
        const prettyError: ErrorResponse = prettyAuthError(err.message) 
        reply
          .code(prettyError.code)
          .type('application/json; charset=utf-8')
          .send({error: prettyError.error})
      }
    })
    app.register(swaggerUI, {
      routePrefix: '/docs'
    });
    app.register(authPlugin, { prefix: '/auth' })
    app.register(companyPlugin, { prefix: '/company' })
    app.register(tokensPlugin, { prefix: '/tokens' })
    app.register(usersPlugin, { prefix: '/users' })
    app.register(nftsPlugin, { prefix: '/nfts' })
    app.register(rewardsPlugin, { prefix: '/rewards' })
    app.register(apiKeysPlugin, { prefix: '/api_keys' })
    app.register(publicPlugin, { prefix: '/claim' })
    app.register(cors, {
        origin: "*",
        methods: ["GET", "POST"]
      })
    app.get('/ping', (req, res) => res.send('pong'))
    app.setErrorHandler((error, request, reply) => {
        if (error.statusCode === 400) error.name = 'Bad Request'
        if (error.statusCode === 401) error.name = 'Unauthorized'
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
