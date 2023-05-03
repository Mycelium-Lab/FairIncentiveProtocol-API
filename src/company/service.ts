import pg from "../config/db";
import { Company, GetCompany, ReplyCompany } from "../entities";
import { hash } from "../utils/hash";

export async function getCompany(getCompany: GetCompany): Promise<ReplyCompany> {
    try {
        const selectedCompany: Array<ReplyCompany> = 
            await pg
                .select(['name', 'email', 'wallet', 'id', 'phone', 'role_id'])
                //if user choose email for signin in or phone
                .where(getCompany.email ? {email: getCompany.email} : {phone: getCompany.phone})
                .from('companies')
        const company: ReplyCompany = selectedCompany[0]
        return company
    } catch (error) {
        console.error(error)
        return {name: '', wallet: ''}
    }
}

export async function changeName(company: GetCompany, newName: string): Promise<boolean> {
    try {
        await pg('companies')
            .where(company.email ? {email: company.email} : {phone: company.phone})
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
            .where(company.email ? {email: company.email} : {phone: company.phone})
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
            .where(company.email ? {email: company.email} : {phone: company.phone})
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
            .where(company.email ? {email: company.email} : {phone: company.phone})
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
            .where(company.email ? {email: company.email} : {phone: company.phone})
            .update({
                password: hashedPassword
            })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}



