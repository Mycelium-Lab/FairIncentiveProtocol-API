import pg from "../config/db";
import { Company, ErrorResponse, GetCompany, SuccessResponse, Token } from "../entities";
import { CODES, SuccessResponseTypes } from "../utils/constants";

export async function addToken(token: Token, getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const newToken: Array<Token> = await pg('erc20_tokens')
            .insert({
                company_id: getCompany.company_id,
                name: token.name,
                symbol: token.symbol,
                supply_type: token.supply_type,
                chainid: token.chainid,
                address: token.address,
                max_supply: token.max_supply,
                initial_supply: token.initial_supply,
                pausable: token.pausable,
                burnable: token.burnable,
                blacklist: token.blacklist,
                recoverable: token.recoverable,
                verified: token.verified,
                fpmanager: token.fpmanager,
                image: token.image
            })
            .returning('*')
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'The token was successfully added',
                type: SuccessResponseTypes.object,
                data: newToken[0]
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }
}

export async function getTokens(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const tokens: Array<Token> = await pg('erc20_tokens')
            .select('*')
            .where({
                company_id: getCompany.company_id
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Tokens',
                type: SuccessResponseTypes.array,
                data: tokens
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err: ErrorResponse = {
            code: CODES.INTERNAL_ERROR.code,
            error: {
                name: CODES.INTERNAL_ERROR.name,
                message: error.message
            }
        }
        return err
    }    
}