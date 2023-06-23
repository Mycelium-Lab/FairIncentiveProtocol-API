import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { signinCompany } from "../../../utils/utils"

let fastify: FastifyInstance
let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");
let signinCompanyWrongEmail = Object.assign(signinCompany)
signinCompanyWrongEmail.email = "wrong@email.com"

beforeAll(async () => {
    fastify = await build()
    await fastify.listen()
})

afterAll(async () => {
    await fastify.close()
})

describe("Auth:Signin:Validation:Email", () => {
    test("Should get error (err: this company not exist)", async () => {
        const raw = JSON.stringify(signinCompanyWrongEmail)
        const response = await fetch(
            `http://localhost:${config.PORT}/auth/signin`,
            {
                method: 'post',
                headers: headers,
                body: raw
            }
        )
        expect(response.status).toEqual(CODES.NOT_FOUND.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: ErrorResponse = await response.json()
        expect(res.error.message).toEqual("Company not exist with this <email>")
    })
    test("Should get validation error (err: email must be string)", async () => {
        signinCompanyWrongEmail.email = {}
        const raw = JSON.stringify(signinCompanyWrongEmail)
        const response = await fetch(
            `http://localhost:${config.PORT}/auth/signin`,
            {
                method: 'post',
                headers: headers,
                body: raw
            }
        )
        expect(response.status).toEqual(CODES.BAD_REQUEST.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: ErrorResponse = await response.json()
        expect(res.error.message).toEqual("<email> must be string")
    })
    test("Should get validation error (err: email is required)", async () => {
        delete signinCompanyWrongEmail.email
        const raw = JSON.stringify(signinCompanyWrongEmail)
        const response = await fetch(
            `http://localhost:${config.PORT}/auth/signin`,
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