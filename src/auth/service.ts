import pg from "../config/db";
import { PrettyError, AuthServiceReply, SignInCompany, SignUpCompany, Company } from "../entities";
import { prettyAuthError } from "../errors";
import { compare, hash } from "../utils/hash";

export async function createCompany(company: SignUpCompany): Promise<AuthServiceReply> {
    try {
        const hashedPassword: string | null = await hash(company.password)
        if (hashedPassword) {
            company.password = hashedPassword
        } else {
            throw Error('Something wrong with hashed password')
        }
        await pg('companies')
            .insert(
                {
                    name: company.name,
                    email: company.email,
                    password: company.password,
                    wallet: company.wallet,
                    phone: company.phone
                }
            )
        return {
            isError: false,
            code: 200,
            res: {
                message: "Company added to database"
            }
        }
    } catch (error: any) {
        console.log(error)
        const prettyError: PrettyError = prettyAuthError(error.message)
        return {
            isError: true,
            code: prettyError.code,
            res: {
                message: prettyError.message
            }
        }
    }
}

export async function checkCompany(company: SignInCompany): Promise<AuthServiceReply> {
    try {
        if (!company.email && !company.phone) throw Error('Either email or phone number must be filled in')
        const selectedCompany: Array<Company> = 
            await pg
                .select('*')
                //if user choose email for signin in or phone
                .where(company.email ? {email: company.email} : {phone: company.phone})
                .from('companies')
        if (selectedCompany.length === 0) throw Error('Not exist')
        const checkedPassword = await compare(company.password, selectedCompany[0].password)
        if (!checkedPassword) throw Error('Wrong password')
        return {
            isError: false,
            code: 200,
            res: {
                message: "OK"
            }
        }
    } catch (error: any) {
        const prettyError: PrettyError = prettyAuthError(error.message)
        return {
            isError: true,
            code: prettyError.code,
            res: {
                message: prettyError.message
            }
        }
    }
}