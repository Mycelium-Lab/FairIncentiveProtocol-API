import pg from "../config/db";
import { ApiKey, ErrorResponse, GetCompany, SuccessResponse } from "../entities";
import { prettyApiKeysError } from "../errors";
import { CODES, SuccessResponseTypes } from "../utils/constants";

export async function getApiKeys(company: GetCompany): Promise<SuccessResponse | ErrorResponse> {
    try {
        const keys: Array<ApiKey> = await pg('api_keys').select('*').where({company_id: company.company_id})
        return {
            code: CODES.OK.code,
            body: {
                type: SuccessResponseTypes.array,
                data: keys,
                message: "Api keys"
            }
        }
    } catch (error: any) {
        console.log(error.message)
        const prettyError: ErrorResponse = prettyApiKeysError(error.message)
        return prettyError
    }
}

export async function createApiKey(company: GetCompany, key: string): Promise<SuccessResponse | ErrorResponse> {
    try {
        await pg('api_keys').insert({company_id: company.company_id, key})
        return {
            code: CODES.OK.code,
            body: {
                type: SuccessResponseTypes.string,
                data: key,
                message: "Api key was successfully created"
            }
        }
    } catch (error: any) {
        console.log(error.message)
        const prettyError: ErrorResponse = prettyApiKeysError(error.message)
        return prettyError
    }
}

export async function deleteApiKey(company: GetCompany, key: string): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg.raw('DELETE FROM api_keys WHERE company_id=? AND key=?', [company.company_id, key])
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Api key was successfully deleted',
                type: SuccessResponseTypes.nullType,
                data: null
            }
        }
        return res   
    } catch (error: any) {
        console.log(error.message)
        const prettyError: ErrorResponse = prettyApiKeysError(error.message)
        return prettyError
    }
}