import { FastifyInstance } from 'fastify';
import { build } from '../../src/app'
import { config } from '../../src/config/config'
import { CODES } from '../../src/utils/constants';
import { createBasicCompany, generateRandomEmail, generateRandomString, randomBasicCompany, signinBasicCompany } from '../utils/utils';
import { ErrorResponse, SignUpCompany, SuccessResponse, User } from '../../src/entities';
import { generateRandomWalletAddress } from '../utils/utils';
import pg from '../../src/config/db';
import { notDeepEqual } from 'assert';

let fastify: FastifyInstance
let jwtToken: string
let headers = new Headers()
let company: SignUpCompany
let api_key: string

beforeAll(async () => {
    fastify = await build()
    await fastify.listen()
    company = await randomBasicCompany()
    await createBasicCompany(company)
    jwtToken = await signinBasicCompany({email: company.email, password: company.password})
    headers.append('Authorization', `Bearer ${jwtToken}`)
})

afterAll(async () => {
    await fastify.close()
    await pg.raw("DELETE FROM companies WHERE email=?", [company.email])
    await pg.raw("DELETE FROM api_keys")
    await pg.destroy()
})

describe('ApiKeys', () => {
    test('Should create api_key and get it back', async () => {
        const response = await fetch(`http://localhost:${config.PORT}/api_keys/create`, {
            method: "POST",
            headers
        })
        expect(response.status).toEqual(CODES.OK.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: SuccessResponse = await response.json() 
        expect(res.body.message).toEqual("Api key was successfully created")
        api_key = res.body.data
    })
    test('Should get all api_keys', async () => {
        const response = await fetch(`http://localhost:${config.PORT}/api_keys`, {
            method: "GET",
            headers
        })
        expect(response.status).toEqual(CODES.OK.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
        const res: SuccessResponse = await response.json() 
        expect(res.body.type).toEqual("array<object>")
        expect(Array.isArray(res.body.data))
        expect(res.body.data.length)
    })
    test('Should make call with api_key', async () => {
        const headerBefore = headers.get('Authorization')
        headers.set("Authorization", `Bearer ${api_key}`)
        const headerAfter = headers.get('Authorization')
        expect(headerAfter).not.toEqual(headerBefore)
        const response = await fetch(`http://localhost:${config.PORT}/company`, {
            method: "GET",
            headers
        })
        expect(response.status).toEqual(CODES.OK.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    })
    test('Should delete api_key', async () => {
        headers.append("Content-Type", "application/json")
        const response = await fetch(`http://localhost:${config.PORT}/api_keys/delete`, {
            method: "POST",
            headers,
            body: JSON.stringify({key: api_key})
        })
        expect(response.status).toEqual(CODES.OK.code)
        expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    })
    //TODO: нельзя воспользоваться ключом вновь
})