import pg from "../config/db";
import { AddToken, Company, GetCompany, Token } from "../entities";

export async function addToken(token: AddToken, getCompany: GetCompany): Promise<boolean> {
    try {
        await pg('erc20_tokens')
            .insert({
                company_id: getCompany.company_id,
                name: token.name,
                symbol: token.symbol,
                supply_type: 3, //UNLIMITED
                chain_id: token.chainid,
                address: token.address
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getTokens(getCompany: GetCompany): Promise<Array<Token>> {
    try {
        const tokens: Array<Token> = await pg('erc20_tokens')
            .select('*')
            .where({
                company_id: getCompany.company_id
            })
        return tokens
    } catch (error) {
        console.log(error)
        return []
    }
}