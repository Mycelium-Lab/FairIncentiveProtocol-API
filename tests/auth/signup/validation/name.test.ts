import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { company, generateRandomEmail, generateRandomString } from "../../utils/utils"

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
    test("Should get validation error (err: name is empty)", async () => {
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
    test("Should get validation error (err: name must be string)", async () => {
        wrongNameCompany.name = {}
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
        expect(res.error.message).toEqual("<name> must be string")
    })
    test("Should get validation error (err: max length is 256)", async () => {
        const exceededName = generateRandomString(257)
        wrongNameCompany.name = exceededName
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
        expect(res.error.message).toEqual("<name> length must be less than or equal to 256 characters long")
    })
})