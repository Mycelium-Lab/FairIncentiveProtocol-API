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

describe('Users:Add:Validation:Properties', () => {
    test('Should get validation error (err: properties must be array)', async () => {
        user.properties = {}
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties> must be array")
    });
    test('Should get validation error (err: properties[0] must be object)', async () => {
        user.properties = ['string']
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties/0> must be object")
    });
    test('Should get validation error (err: properties[0].name is required)', async () => {
        user.properties = [{}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].name> is required")
    });
    test('Should get validation error (err: properties[0].name must be string)', async () => {
        user.properties = [{name: 19}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].name> must be a string")
    });
    test('Should get validation error (err: properties[0].name must be string)', async () => {
        user.properties = [{name: null}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].name> must be a string")
    });
    test('Should get validation error (err: properties[0].name is not allowed to be empty)', async () => {
        user.properties = [{name: ''}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].name> is not allowed to be empty")
    });
    test('Should get validation error (err: properties[0].value is required)', async () => {
        user.properties = [{name: generateRandomString(10)}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].value> is required")
    });
    test('Should get validation error (err: properties[0].value must be string)', async () => {
        user.properties = [{name: generateRandomString(10), value: 19}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].value> must be a string")
    });
    test('Should get validation error (err: properties[0].value must be string)', async () => {
        user.properties = [{name: generateRandomString(10), value: null}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].value> must be a string")
    });
    test('Should get validation error (err: properties[0].value is not allowed to be empty)', async () => {
        user.properties = [{name: generateRandomString(10), value: ''}]
        const res = await sendRequest(user)
        expect(res.error.message).toEqual("<properties[0].value> is not allowed to be empty")
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