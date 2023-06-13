import tap from 'tap'
import { build } from '../../../../app'
import { config } from '../../../../config/config'
import { FastifyInstance } from 'fastify'
import pg from '../../../../config/db'
import { ErrorResponse, SuccessResponse } from '../../../../entities'
import { CODES } from '../../../../utils/constants'

let fastify: FastifyInstance

let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");
let raw: string

tap.before(async () => {
    await pg.raw('DELETE FROM companies')
    await pg.destroy()
})

tap.beforeEach(async () => {
    fastify = await build()  
    await fastify.listen()
})

tap.test('Auth:Signup:Validation - Country code is incorrect', async t => {
    t.plan(3)
    let body: object = {
        "name": 'ООО Утка',
        "email": "qwe@qwe.com",
        "password": "1234s5678",
        "repeat_password": "1234s5678",
        "wallet": "0x0000000000000000000000000000000000000001",
        "country": "SOMECODE",
        "repname": "somename"
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
  
    t.equal(response.status, CODES.BAD_REQUEST.code)
    t.equal(response.headers.get('content-type'), 'application/json; charset=utf-8')
    const res: ErrorResponse = await response.json()
    t.same(res.error.message, "Country code is incorrect <country>")
})


