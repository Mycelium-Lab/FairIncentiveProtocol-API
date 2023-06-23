import { FastifyInstance } from 'fastify';
import { build } from '../../../../src/app'
import { config } from '../../../../src/config/config'
import { CODES } from '../../../../src/utils/constants';
import { createBasicCompany, generateRandomString, randomBasicCompany, signinBasicCompany } from '../../../utils/utils';
import { ErrorResponse, SignUpCompany } from '../../../../src/entities';
import pg from '../../../../src/config/db';

let fastify: FastifyInstance
let jwtToken: string
let headers = new Headers()
let company: SignUpCompany

beforeAll(async () => {
    fastify = await build()
    await fastify.listen()
    company = await randomBasicCompany()
    await createBasicCompany(company)
    jwtToken = await signinBasicCompany({email: company.email, password: company.password})
    headers.append('Authorization', `Bearer ${jwtToken}`)
    headers.append("Content-Type", "application/json")
})

afterAll(async () => {
    await fastify.close()
    await pg.raw("DELETE FROM companies WHERE email=?", [company.email])
    await pg.destroy()
})

describe('Users:Add:Validation:Email', () => {
    test('Should get validation error (err: email must be string)', async () => {
        const randomWrongEmail = {}
        const res = await sendRequest({external_id: 'somename', email: randomWrongEmail})
        expect(res.error.message).toEqual("<email> must be string")
    });
    test('Should get validation error (err: email must be valid)', async () => {
        const randomWrongEmail = generateRandomString(10)
        const res = await sendRequest({external_id: 'somename', email: randomWrongEmail})
        expect(res.error.message).toEqual("<email> must be a valid email")
    });
    test('Should get validation error (err: email not exist)', async () => {
        const randomWrongEmail = null
        const res = await sendRequest({external_id: 'somename', email: randomWrongEmail})
        expect(res.error.message).toEqual("<email> is not allowed to be empty")
    });
})

async function sendRequest(user: any): Promise<ErrorResponse> {
    const response = await fetch(`http://localhost:${config.PORT}/users/add`, {
        method: "POST",
        headers,
        body: JSON.stringify({external_id: user.external_id, email: user.email})
    })
    expect(response.status).toEqual(CODES.BAD_REQUEST.code)
    expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    const res: ErrorResponse = await response.json() 
    expect(res.error.name).toEqual(CODES.BAD_REQUEST.name)
    return res
}