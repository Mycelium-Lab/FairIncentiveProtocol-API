import pg from "../config/db";
import { PrettyError, AuthServiceReply, SignInCompany, SignUpCompany, Company, ErrorResponse, SuccessResponse } from "../entities";
import { prettyAuthError } from "../errors";
import { CODES, SuccessResponseTypes } from "../utils/constants";
import { compare, hash } from "../utils/hash";

export async function checkCompany(company: SignInCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        if (!company.email && !company.phone) throw Error('Either email or phone number must be filled in')
        const selectedCompany: Company = 
            await pg
                .select('*')
                //if user choose email for signin in or phone
                .where(company.email ? {email: company.email} : {phone: company.phone})
                .first()
                .from('companies')
        if (selectedCompany == undefined) throw Error('Not exist')
        const checkedPassword = await compare(company.password, selectedCompany.password)
        if (!checkedPassword) throw Error('Wrong password')
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Password is ok',
                type: SuccessResponseTypes.nullType,
                data: {
                    company_id: selectedCompany.id,
                    address: selectedCompany.wallet
                }
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