import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { company, generateRandomEmail } from "../../utils/utils"

let wrongNameCompany = Object.assign(company)
wrongNameCompany.name = ""
wrongNameCompany.email = generateRandomEmail()

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

describe("Auth:Signup:Validation:Name", () => {
    test("Should get validation error (err: country code is empty)", async () => {
        const raw = JSON.stringify(wrongNameCompany)
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
        expect(res.error.message).toEqual("<name> is not allowed to be empty")
    })
})