import { FastifyInstance } from 'fastify';
import { build } from '../../../../src/app'
import { config } from '../../../../src/config/config'
import { CODES } from '../../../../src/utils/constants';
import { createBasicCompany, generateRandomEmail, generateRandomString, randomBasicCompany, signinBasicCompany } from '../../../utils/utils';
import { ErrorResponse, SignUpCompany } from '../../../../src/entities';
import pg from '../../../../src/config/db';

let fastify: FastifyInstance
let jwtToken: string
let headers = new Headers()
let company: SignUpCompany
let user: any = {
    email: generateRandomEmail(),
    external_id: generateRandomString(10)
}

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

describe('Users:Add:Validation:Wallet', () => {
    test('Should get validation error (err: wallet must be string)', async () => {
        user.wallet = {}
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<wallet> must be string")
    });
    test('Should get validation error (err: wallet cant be null, wallet = empty string)', async () => {
        user.wallet = ''
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<wallet> can't be null")
    });
    test('Should get validation error (err: wallet cant be null, wallet = null)', async () => {
        user.wallet = null
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<wallet> can't be null")
    });
    test('Should get validation error (err: wallet is wrong format)', async () => {
        user.wallet = generateRandomString(10)
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<wallet> is incorrect")
    });
    test('Should get validation error (err: wallet is required)', async () => {
        delete user.wallet
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<wallet> is required")
    });
})

async function sendRequest(user: any): Promise<ErrorResponse> {
    const response = await fetch(`http://localhost:${config.PORT}/users/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(user)
    })    
    const res: ErrorResponse = await response.json() 
    expect(response.status).toEqual(CODES.BAD_REQUEST.code)
    expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    expect(res.error.name).toEqual(CODES.BAD_REQUEST.name)
    return res
}