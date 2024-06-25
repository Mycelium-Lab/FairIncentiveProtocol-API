import pg from "../config/db";
import { Company, ErrorResponse, ReplyCompany, SuccessResponse } from "../entities";
import { CODES } from "../utils/constants";

export async function checkCompanyOnThisEmailExist(email: string): Promise<Company | undefined> {
    try {
        const selectedCompany: Company = 
            await pg
                .select('*')
                .where({email})
                .from('companies')
                .first()
        if (selectedCompany) return selectedCompany
        return undefined
    } catch (error: any) {
        console.log(error)
        return undefined
    }
}