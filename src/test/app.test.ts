import tap from 'tap'
import { build } from '../app'
import { config } from '../config/config'

tap.test('Should check if app is running', async t => {
  t.plan(3)

  const fastify = await build()

  t.teardown(() => fastify.close())

  await fastify.listen()
  
  const response = await fetch(
    `http://localhost:${config.PORT}/ping` 
  )

  t.equal(response.status, 200)
  t.equal(
    response.headers.get('content-type'),
    'text/plain; charset=utf-8'
  )

  t.has(await response.text(), 'pong')
})