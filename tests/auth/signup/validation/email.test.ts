import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse, SignUpCompany } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { company, createBasicCompany, randomBasicCompany } from "../../../utils/utils"
import pg from "../../../../src/config/db"

let wrongEmailCompany = Object.assign(company)
wrongEmailCompany.name = "somename"
wrongEmailCompany.email = "qwe"

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
    test("Should get validation error (err: email must be string)", async () => {
        wrongEmailCompany.email = {}
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
        expect(res.error.message).toEqual("<email> must be string")
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
    test("Should get validation error (err: email already exist)", async () => {
        await createBasicCompany(_company)
        const raw = JSON.stringify(_company)
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
        expect(res.error.message).toEqual("This <email> already exist")
    })
})