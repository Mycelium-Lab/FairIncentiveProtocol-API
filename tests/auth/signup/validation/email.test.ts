import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { company } from "../../utils/utils"

let wrongEmailCompany = Object.assign(company)
wrongEmailCompany.name = "somename"
wrongEmailCompany.email = "qwe"

let fastify: FastifyInstance
let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");

beforeAll(async () => {
    fastify = await build()
    await fastify.listen()
})

afterAll(async () => {
    await fastify.close()
})

describe("Auth:Signup:Validation:Email", () => {
    test("Should get validation error (err: email is incorrect)", async () => {
        const raw = JSON.stringify(wrongEmailCompany)
        const response = await fetch(
            `http://localhost:${config.PORT}/auth/signup`,
            {
                method: 'post',
                headers: headers,
                body: raw
            }
        )
        expect(response.status).toEqual(CODES.BAD_REQUEST.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: ErrorResponse = await response.json()
        expect(res.error.message).toEqual("<email> must be a valid email")
    })
    test("Should get validation error (err: email is empty)", async () => {
        //delete email from body to check reaction
        delete wrongEmailCompany.email
        const raw = JSON.stringify(wrongEmailCompany)
        const response = await fetch(
            `http://localhost:${config.PORT}/auth/signup`,
            {
                method: 'post',
                headers: headers,
                body: raw
            }
        )
        expect(response.status).toEqual(CODES.BAD_REQUEST.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: ErrorResponse = await response.json()
        expect(res.error.message).toEqual("<email> is required")
    })
})