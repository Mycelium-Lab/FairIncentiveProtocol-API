import pg from "../config/db";
import { AuthServiceReply, Company, GetCompany, PrettyError, ReplyCompany, SignUpCompany } from "../entities";
import { prettyAuthError } from "../errors";
import { hash } from "../utils/hash";

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
            data: {},
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
            data: {},
            res: {
                message: prettyError.message
            }
        }
    }
}

export async function getCompany(getCompany: GetCompany): Promise<ReplyCompany> {
    try {
        const selectedCompany: ReplyCompany = 
            await pg
                .select(['name', 'email', 'wallet', 'id', 'phone', 'role_id'])
                .where({id: getCompany.company_id})
                .from('companies')
                .first()
        return selectedCompany
    } catch (error) {
        console.error(error)
        return {name: '', wallet: ''}
    }
}

export async function changeName(company: GetCompany, newName: string): Promise<boolean> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                name: newName
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function changeEmail(company: GetCompany, newEmail: string): Promise<boolean> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                email: newEmail
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function changePhone(company: GetCompany, newPhone: string): Promise<boolean> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                phone: newPhone
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function changeWallet(company: GetCompany, newWallet: string): Promise<boolean> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                wallet: newWallet
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function changePassword(company: GetCompany, newPassword: string): Promise<boolean> {
    try {
        const hashedPassword = await hash(newPassword)
        await pg('companies')
            .where({id: company.company_id})
            .update({
                password: hashedPassword
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}



