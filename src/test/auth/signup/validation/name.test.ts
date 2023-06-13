import tap from 'tap'
import { build } from '../../../../app'
import { config } from '../../../../config/config'
import { FastifyInstance } from 'fastify'
import { ErrorResponse } from '../../../../entities'

let fastify: FastifyInstance

let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");
let raw: string

tap.beforeEach(async () => {
    fastify = await build()  
    await fastify.listen()
})

tap.test('Auth:Signup:Validation - Сompany name is incorrect(err: less than 3 symbols)', async t => {
  t.plan(3)
  let body: object = {
      "name": "",
      "email": "123@gal.com",
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
  const res: ErrorResponse = await response.json()
  t.same(res.error.message, "<name> is not allowed to be empty")
})


tap.test('Auth:Signup:Validation - Сompany name is incorrect(err: more than 256 symbols)', async t => {
    const randomNameLength300 = Array.from({length: 300}, () => String.fromCharCode(Math.floor(Math.random() * (126 - 32 + 1)) + 32)).join('')
    t.plan(3)
    let body: object = {
        "name": randomNameLength300,
        "email": "123@gal.com",
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
    const res: ErrorResponse = await response.json()
    t.same(res.error.message, "<name> length must be less than or equal to 256 characters long")
})


tap.test('Auth:Signup:Validation - Сompany name is incorrect(err: empty)', async t => {
    t.plan(3)
    let body: object = {
        "email": "123@gal.com",
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
    const res: ErrorResponse = await response.json()
    t.same(res.error.message, "<name> is required")
})