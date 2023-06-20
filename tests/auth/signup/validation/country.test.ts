import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { company, generateRandomEmail } from "../../utils/utils"

let wrongCodeCompany = Object.assign(company)
wrongCodeCompany.name = "somename"
wrongCodeCompany.email = generateRandomEmail()
wrongCodeCompany.country = "SOMECODE"

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

describe("Auth:Signup:Validation:Country", () => {
    test("Should get validation error (err: country code is incorrect)", async () => {
        const raw = JSON.stringify(wrongCodeCompany)
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
        expect(res.error.message).toEqual("Country code is incorrect <country>")
    })
    test("Should get validation error (err: country code is empty)", async () => {
        delete wrongCodeCompany.country
        const raw = JSON.stringify(wrongCodeCompany)
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
        expect(res.error.message).toEqual("<country> is required")
    })
})