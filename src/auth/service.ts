import pg from "../config/db";
import { PrettyError, AuthServiceReply, SignInCompany, SignUpCompany, Company } from "../entities";
import { prettyAuthError } from "../errors";
import { compare, hash } from "../utils/hash";

export async function checkCompany(company: SignInCompany): Promise<AuthServiceReply> {
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
        return {
            isError: false,
            code: 200,
            data: { company_id: selectedCompany.id },
            res: {
                message: "OK"
            }
        }
    } catch (error: any) {
        const prettyError: PrettyError = prettyAuthError(error.message)
        return {
            isError: true,
            code: prettyError.code,
            data: {},
            res: {
                message: prettyError.message
            }
        }
    }
}