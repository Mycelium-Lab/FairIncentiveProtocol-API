import { FastifyInstance } from 'fastify';
import { build } from '../../../../src/app'
import { config } from '../../../../src/config/config'
import { CODES } from '../../../../src/utils/constants';
import { createBasicCompany, generateRandomEmail, generateRandomString, generateRandomWalletAddress, randomBasicCompany, signinBasicCompany } from '../../../utils/utils';
import { ErrorResponse, SignUpCompany, User } from '../../../../src/entities';
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
    headers.append('Authorization', `Bearer ${jwtToken.slice(0, jwtToken.length - 1)}`)
    headers.append("Content-Type", "application/json")
})

afterAll(async () => {
    await fastify.close()
    await pg.raw("DELETE FROM companies WHERE email=?", [company.email])
    await pg.destroy()
})

describe('Users:Add:Validation:JWT', () => {
    test('Should get validation error (err: jwtToken is invalid)', async () => {
        const user: User = {
            external_id: generateRandomString(10),
            email: generateRandomEmail(),
            wallet: generateRandomWalletAddress(),
            notes: generateRandomString(10),
            properties: [],
            stats: []
        }        
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("Authorization token is invalid: The token signature is invalid.")
    })
    test('Should get validation error (err: jwtToken is not exist)', async () => {
        const user: User = {
            external_id: generateRandomString(10),
            email: generateRandomEmail(),
            wallet: generateRandomWalletAddress(),
            notes: generateRandomString(10),
            properties: [],
            stats: []
        }    
        headers.delete('Authorization')
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("No Authorization was found in request.headers")
    })
})

async function sendRequest(user: User): Promise<ErrorResponse> {
    const response = await fetch(`http://localhost:${config.PORT}/users/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(user)
    })
    expect(response.status).toEqual(CODES.UNAUTHORIZED.code)
    expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    const res: ErrorResponse = await response.json() 
    expect(res.error.name).toEqual(CODES.UNAUTHORIZED.name)
    return res
}