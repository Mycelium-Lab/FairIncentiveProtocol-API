import pg from "../config/db";
import { Company, DeleteUser, GetCompany, User } from "../entities";

export async function addUser(user: User, getCompany: GetCompany): Promise<string | null> {
    try {
        const company: Company = 
            await pg('companies')
                .select('*')
                .where(getCompany.email ? {email: getCompany.email} : {phone: getCompany.phone})
                .first()
        const createdUserID: any = await pg('users')
            .insert({
                company_id: company.id,
                firstname: user.firstname,
                lastname: user.lastname,
                patronymic: user.patronymic,
                email: user.email,
                wallet: user.wallet
            })
            .returning('id');
        return createdUserID[0].id
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getUsers(getCompany: GetCompany): Promise<Array<User>> {
    try {
        const company: Company = 
            await pg('companies')
                .select('*')
                .where(getCompany.email ? {email: getCompany.email} : {phone: getCompany.phone})
                .first()
        const users: Array<User> = 
            await pg
                .select('*')
                .where({
                    company_id: company.id
                })
                .from('users')
        return users
    } catch (error) {
        console.log(error)
        return []
    }    
}

export async function deleteUser(deleteUser: DeleteUser, getCompany: GetCompany): Promise<boolean> {
    try {
        const company: Company = 
            await pg('companies')
                .select('*')
                .where(getCompany.email ? {email: getCompany.email} : {phone: getCompany.phone})
                .first()
        await pg('users').where({company_id: company.id, id: deleteUser.id}).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}