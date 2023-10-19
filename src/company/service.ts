import pg from "../config/db";
import { AuthServiceReply, Company, ErrorResponse, GetCompany, PrettyError, ReplyCompany, SignUpCompany, SuccessResponse } from "../entities";
import { prettyAuthError, prettyCompanyError } from "../errors";
import { CODES, SuccessResponseTypes } from "../utils/constants";
import { hash } from "../utils/hash";

export async function createCompany(company: SignUpCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const hashedPassword: string | null = await hash(company.password)
        if (hashedPassword) {
            company.password = hashedPassword
        } else {
            throw Error('Something wrong with hashed password')
        }
        const id = await pg('companies')
            .insert(
                {
                    name: company.name,
                    email: company.email,
                    password: company.password,
                    phone: company.phone,
                    repname: company.repname,
                    country: company.country
                }
            , "id")
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'The company was successfully added',
                type: SuccessResponseTypes.string,
                data: id[0].id
            }
        }
        return res
    } catch (error: any) {
        console.log(error.message)
        const err = prettyCompanyError(error.message)
        console.log(err)
        return err
    }
}

export async function getCompany(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        const selectedCompany: ReplyCompany = 
            await pg
                .select(['name', 'email', 'wallet', 'id', 'phone', 'role_id', 'repname'])
                .where({id: getCompany.company_id})
                .from('companies')
                .first()
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Company',
                type: SuccessResponseTypes.object,
                data: selectedCompany
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

export async function changeName(company: GetCompany, newName: string): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                name: newName
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Company name has been successfully updated',
                type: SuccessResponseTypes.nullType,
                data: null
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

export async function changeEmail(company: GetCompany, newEmail: string): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                email: newEmail
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Company email has been successfully updated',
                type: SuccessResponseTypes.nullType,
                data: null
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

export async function changePhone(company: GetCompany, newPhone: string): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                phone: newPhone
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Company phone has been successfully updated',
                type: SuccessResponseTypes.nullType,
                data: null
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

export async function changeWallet(company: GetCompany, newWallet: string): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                wallet: newWallet
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Company wallet has been successfully updated',
                type: SuccessResponseTypes.nullType,
                data: null
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

export async function changePassword(company: GetCompany, newPassword: string): Promise<ErrorResponse | SuccessResponse> {
    try {
        const hashedPassword = await hash(newPassword)
        await pg('companies')
            .where({id: company.company_id})
            .update({
                password: hashedPassword
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Company password has been successfully updated',
                type: SuccessResponseTypes.nullType,
                data: null
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

export async function changeRepname(company: GetCompany, newRepname: string): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg('companies')
            .where({id: company.company_id})
            .update({
                repname: newRepname
            })
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Company repname has been successfully updated',
                type: SuccessResponseTypes.nullType,
                data: null
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