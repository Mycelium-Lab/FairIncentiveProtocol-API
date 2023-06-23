import { FastifyInstance } from 'fastify';
import { build } from '../../../../src/app'
import { config } from '../../../../src/config/config'
import { CODES } from '../../../../src/utils/constants';
import { createBasicCompany, generateRandomEmail, generateRandomString, generateRandomWalletAddress, randomBasicCompany, signinBasicCompany } from '../../../utils/utils';
import { ErrorResponse, SignUpCompany } from '../../../../src/entities';
import pg from '../../../../src/config/db';

let fastify: FastifyInstance
let jwtToken: string
let headers = new Headers()
let company: SignUpCompany
let user: any = {
    email: generateRandomEmail(),
    external_id: generateRandomString(10),
    wallet: generateRandomWalletAddress()
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

describe('Users:Add:Validation:Notes', () => {
    test('Should get validation error (err: notes must be string)', async () => {
        user.notes = {}
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<notes> must be null,string")
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