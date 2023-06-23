import { FastifyInstance } from "fastify"
import pg from "../../../src/config/db"
import { build } from "../../../src/app"
import { SignUpCompany } from "../../../src/entities"
import { config } from "../../../src/config/config"
import { CODES } from "../../../src/utils/constants"
import { randomBasicCompany } from "../../utils/utils"

let fastify: FastifyInstance
let headers: Headers = new Headers()
headers.append("Content-Type", "application/json")
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

describe("Auth:Signup", () => {
    test("Should create a company", async () => {
        const raw = JSON.stringify(_company)
        const response = await fetch(
            `http://localhost:${config.PORT}/auth/signup`,
            {
                method: 'post',
                headers: headers,
                body: raw
            }
        )
        expect(response.status).toEqual(CODES.OK.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    })
})