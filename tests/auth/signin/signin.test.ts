import { FastifyInstance } from "fastify"
import pg from "../../../src/config/db"
import { build } from "../../../src/app"
import { SignUpCompany, SuccessResponse } from "../../../src/entities"
import { config } from "../../../src/config/config"
import { CODES } from "../../../src/utils/constants"
import { createBasicCompany, randomBasicCompany } from "../utils/utils"

let fastify: FastifyInstance
let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");
let _company: SignUpCompany

beforeAll(async () => {
    fastify = await build()
    await fastify.listen()
    _company = await randomBasicCompany()
})

afterAll(async () => {
    await fastify.close()
    await pg.raw("DELETE FROM companies WHERE email=?", [_company.email])
    await pg.destroy()
})

describe("Auth:Signin", () => {
    test("Should signin and get jwt token", async () => {
        //create company
        await createBasicCompany(_company)
        const raw = JSON.stringify({email: _company.email, password: _company.password})
        const response = await fetch(
            `http://localhost:${config.PORT}/auth/signin`,
            {
                method: 'post',
                headers: headers,
                body: raw
            }
        )
        expect(response.status).toEqual(CODES.OK.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: SuccessResponse = await response.json()
        let jwtToken = res.body.data.token
        let signinHeaders = new Headers()
        signinHeaders.append('Authorization', `Bearer ${jwtToken}`)
        const responseCompany = await fetch(`http://localhost:${config.PORT}/company`, { headers: signinHeaders })
        expect(responseCompany.status).toEqual(CODES.OK.code)
        expect(responseCompany.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const resCompany: SuccessResponse = await responseCompany.json()
        expect(resCompany.body.message).toEqual("Company")
        expect(resCompany.body.data.email).toEqual(_company.email)
    })
})