import { FastifyInstance } from "fastify"
import { build } from "../../../../src/app"
import { ErrorResponse } from "../../../../src/entities"
import { config } from "../../../../src/config/config"
import { CODES } from "../../../../src/utils/constants"
import { createBasicCompany, randomBasicCompany } from "../../utils/utils"
import pg from "../../../../src/config/db"

let fastify: FastifyInstance
let headers: Headers = new Headers();
headers.append("Content-Type", "application/json");
let _company: any

beforeAll(async () => {
    fastify = await build()
    await fastify.listen()
    _company = await randomBasicCompany()
    await createBasicCompany(_company)
})

afterAll(async () => {
    await fastify.close()
    await pg.raw("DELETE FROM companies WHERE email=?", [_company.email])
    await pg.destroy()
})

describe("Auth:Signup:Validation:Password", () => {
    test("Should get validation error (err: password is incorrect)", async () => {
        _company.password = "someotherpassword"
        const raw = JSON.stringify({email: _company.email, password: _company.password})
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
        expect(res.error.message).toEqual("Wrong <password>")
    })
    test("Should get validation error (err: password is empty)", async () => {
        //delete password from body to check reaction
        delete _company.password
        const raw = JSON.stringify(_company)
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
        expect(res.error.message).toEqual("<password> is required")
    })
})