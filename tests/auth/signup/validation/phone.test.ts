import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse, SignUpCompany } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { company, createBasicCompany, generateRandomEmail, generateRandomString, randomBasicCompany } from "../../utils/utils"
import pg from "../../../../src/config/db"

let wrongPhoneCompany = Object.assign(company)
wrongPhoneCompany.name = generateRandomString(10)
wrongPhoneCompany.email = generateRandomEmail()
wrongPhoneCompany.phone = "qweqweqwe"

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

describe("Auth:Signup:Validation:Phone", () => {
    test("Should get validation error (err: phone is incorrect)", async () => {
        const raw = JSON.stringify(wrongPhoneCompany)
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
        expect(res.error.message).toEqual("<phone> did not seem to be a phone number")
    })
    test("Should get validation error (err: phone must be string)", async () => {
        wrongPhoneCompany.phone = {}
        const raw = JSON.stringify(wrongPhoneCompany)
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
        expect(res.error.message).toEqual("<phone> must be string")
    })
    test("Should get validation error (err: phone is empty)", async () => {
        //delete email from body to check reaction
        delete wrongPhoneCompany.phone
        const raw = JSON.stringify(wrongPhoneCompany)
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
        expect(res.error.message).toEqual("<phone> is required")
    })
    test("Should get validation error (err: phone already exist)", async () => {
        await createBasicCompany(_company)
        //change email to get another error
        _company.email = generateRandomEmail()
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
        expect(res.error.message).toEqual("This <phone> already exist")
    })
})