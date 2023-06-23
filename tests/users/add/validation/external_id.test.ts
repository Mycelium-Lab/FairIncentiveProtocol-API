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

describe('Users:Add:Validation:ExternalId', () => {
    test('Should get validation error (err: external_id exceedes 256 symbol)', async () => {
        const randomLongExternalId = generateRandomString(257)
        const res = await sendRequest(randomLongExternalId)
        expect(res.error.message).toEqual("<external_id> length must be less than or equal to 256 characters long")
    });
    test('Should get validation error (err: external_id must be string)', async () => {
        const randomWrongExternalId = ['string', 'string']
        const res = await sendRequest(randomWrongExternalId)
        expect(res.error.message).toEqual("<external_id> must be string")
    });
    test('Should get validation error (err: external_id not exist)', async () => {
        const randomWrongExternalId = null
        const res = await sendRequest(randomWrongExternalId)
        expect(res.error.message).toEqual("<external_id> is not allowed to be empty")
    });
    test('Should get validation error (err: external_id is required)', async () => {
        const response = await fetch(`http://localhost:${config.PORT}/users/add`, {
            method: "POST",
            headers,
            body: JSON.stringify({})
        })
        expect(response.status).toEqual(CODES.BAD_REQUEST.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: ErrorResponse = await response.json() 
        expect(res.error.name).toEqual(CODES.BAD_REQUEST.name)        
        expect(res.error.message).toEqual("<external_id> is required")
    });
})

async function sendRequest(external_id: any): Promise<ErrorResponse> {
    const response = await fetch(`http://localhost:${config.PORT}/users/add`, {
        method: "POST",
        headers,
        body: JSON.stringify({external_id})
    })
    expect(response.status).toEqual(CODES.BAD_REQUEST.code)
    expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    const res: ErrorResponse = await response.json() 
    expect(res.error.name).toEqual(CODES.BAD_REQUEST.name)
    return res
}