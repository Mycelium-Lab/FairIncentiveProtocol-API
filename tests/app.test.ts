import { FastifyInstance } from 'fastify';
import { build } from '../src/app'
import { config } from '../src/config/config'
import { CODES } from '../src/utils/constants';

let fastify: FastifyInstance

beforeAll(async () => {
    fastify = await build()
    await fastify.listen()
})

afterAll(async () => {
    await fastify.close()
})

test('Should check if app is working', async () => {
    const response = await fetch(`http://localhost:${config.PORT}/ping`)
    expect(response.status).toEqual(CODES.OK.code)
    expect(response.headers.get('content-type')).toEqual('text/plain; charset=utf-8')
    expect(await response.text()).toEqual('pong')
});