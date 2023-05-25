import pg from "../config/db";
import { Company, GetCompany, Token } from "../entities";

export async function addToken(token: Token, getCompany: GetCompany): Promise<Token | null> {
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
        return newToken[0]
    } catch (error) {
        console.log(error)
        return null
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