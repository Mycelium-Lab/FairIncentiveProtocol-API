import tap from 'tap'
import { build } from '../../../app'
import { config } from '../../../config/config'
import { FastifyInstance } from 'fastify'

let fastify: FastifyInstance

let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");
let raw: string

tap.beforeEach(async () => {
    fastify = await build()  
    await fastify.listen()
})

tap.test('Email is incorrect (email) - not this format', async t => {
    t.plan(3)
    let body: object = {
        "name": 'ООО Утка',
        "email": "123",
        "password": "1234s5678",
        "repeat_password": "1234s5678",
        "wallet": "0x0000000000000000000000000000000000000001"
    }
    raw = JSON.stringify(body)
    const response = await fetch(
      `http://localhost:${config.PORT}/auth/signup`,
      {
          method: 'post',
          headers: headers,
          body: raw
      }
    )
    t.teardown(() => fastify.close())
  
    t.equal(response.status, 400)
    t.equal(response.headers.get('content-type'), 'application/json; charset=utf-8')
    t.same(await response.json(), { message: "\"email\" must be a valid email" })
})


tap.test('Email is incorrect (email) - empty', async t => {
    t.plan(3)
    let body: object = {
        "name": 'ООО Утка',
        "password": "1234s5678",
        "repeat_password": "1234s5678",
        "wallet": "0x0000000000000000000000000000000000000001"
    }
    raw = JSON.stringify(body)
    const response = await fetch(
      `http://localhost:${config.PORT}/auth/signup`,
      {
          method: 'post',
          headers: headers,
          body: raw
      }
    )
    t.teardown(() => fastify.close())
      
    t.equal(response.status, 400)
    t.equal(response.headers.get('content-type'), 'application/json; charset=utf-8')
    t.same(await response.json(), { message: "\"email\" is required" })
})