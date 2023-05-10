import pg from "../config/db";
import { Company, DeleteUser, GetCompany, User } from "../entities";

export async function addUser(user: User, getCompany: GetCompany): Promise<string | null> {
    try {
        const createdUserID: any = await pg('users')
            .insert({
                company_id: getCompany.company_id,
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
        const users: Array<User> = 
            await pg
                .select('*')
                .where({
                    company_id: getCompany.company_id
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
        await pg('users').where({company_id: getCompany.company_id, id: deleteUser.id}).delete()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}