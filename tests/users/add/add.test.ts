import { FastifyInstance } from 'fastify';
import { build } from '../../../src/app'
import { config } from '../../../src/config/config'
import { CODES } from '../../../src/utils/constants';
import { createBasicCompany, generateRandomEmail, generateRandomString, randomBasicCompany, signinBasicCompany } from '../../utils/utils';
import { ErrorResponse, SignUpCompany, SuccessResponse, User } from '../../../src/entities';
import { generateRandomWalletAddress } from '../../utils/utils';
import pg from '../../../src/config/db';

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
    await pg.raw("DELETE FROM users")
    await pg.destroy()
})

describe('Users:Add', () => {
    test('Should create user without properties and stats', async () => {
        const user: User = {
            external_id: generateRandomString(10),
            email: generateRandomEmail(),
            wallet: generateRandomWalletAddress(),
            notes: generateRandomString(10),
            properties: [],
            stats: []
        }
        const res = await sendRequest(user)
        const createdUser: User = res.body.data
        expect(createdUser.email).toEqual(user.email) 
        expect(createdUser.wallet).toEqual(user.wallet) 
        expect(createdUser.notes).toEqual(user.notes) 
        expect(createdUser.external_id).toEqual(user.external_id) 
    })
    test('Should create user with properties and stats', async () => {
        const user: any = {
            external_id: generateRandomString(10),
            email: generateRandomEmail(),
            wallet: generateRandomWalletAddress(),
            notes: generateRandomString(10),
            properties: [
                {
                    name: "Firstname",
                    value: "Somename"
                }
            ],
            stats: [
                {
                    name: "Age",
                    value: 100
                }
            ]
        }
        //create user
        await sendRequest(user)
        //get all users
        const getResponse = await fetch(`http://localhost:${config.PORT}/users`, {headers})
        const getRes: SuccessResponse = await getResponse.json()
        const createdUser: User = getRes.body.data[getRes.body.data.length - 1]
        //check all properties and stats
        createdUser.properties?.forEach((v, i)=> {
            expect(v.name).toEqual(user.properties[i].name)
            expect(v.value).toEqual(user.properties[i].value)
        })
        createdUser.stats?.forEach((v, i)=> {
            expect(v.name).toEqual(user.stats[i].name)
            expect(v.value).toEqual(user.stats[i].value)
        })
    })
})

async function sendRequest(user: User): Promise<SuccessResponse> {
    const response = await fetch(`http://localhost:${config.PORT}/users/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(user)
    })
    expect(response.status).toEqual(CODES.OK.code)
    expect(response.headers.get('content-type')).toEqual('application/json; charset=utf-8')
    const res: SuccessResponse = await response.json() 
    return res
}