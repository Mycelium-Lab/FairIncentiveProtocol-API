import tap from 'tap'
import { build } from '../../../app'
import { config } from '../../../config/config'
import { FastifyInstance } from 'fastify'
import pg from '../../../config/db'
import { ErrorResponse, SuccessResponse } from '../../../entities'
import { CODES } from '../../../utils/constants'

let fastify: FastifyInstance

const company = {
    email: "qwe@qwe.com",
    password: "1234s5678"
}

let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");
let raw: string
let token: string

tap.before(async () => {
    await pg.raw('DELETE FROM companies')
    await pg.destroy()
    fastify = await build()  
    await fastify.listen()
    //CREATE COMPANY
    let body: object = {
        "name": 'ООО Утка',
        "email": company.email,
        "password": company.password,
        "repeat_password": company.password,
        "wallet": "0x0000000000000000000000000000000000000001",
        "country": "US",
        "repname": "somename",
        "phone": "+79999999999"
    }
    raw = JSON.stringify(body)
    await fetch(
      `http://localhost:${config.PORT}/auth/signup`,
      {
          method: 'post',
          headers: headers,
          body: raw
      }
    )
    const response = await fetch(`http://localhost:${config.PORT}/auth/signin`, {method: 'post', headers, body: JSON.stringify(company)})
    const res: SuccessResponse = await response.json()
    token = res.body.data.token
    await fastify.close()
})

tap.beforeEach(async () => {
    fastify = await build()  
    await fastify.listen()
})

tap.test('Auth:Signin - Should get company from JWT token', async t => {
    t.plan(4)
    t.teardown(() => fastify.close())
    let signinHeaders = new Headers()
    signinHeaders.append('Authorization', `Bearer ${token}`)
    const response = await fetch(`http://localhost:${config.PORT}/company`, { headers: signinHeaders })
    t.equal(response.status, CODES.OK.code)
    t.equal(response.headers.get('content-type'), 'application/json; charset=utf-8')
    const res: SuccessResponse = await response.json()
    t.same(res.body.message, "Company")
    t.same(res.body.data.email, company.email)
})
