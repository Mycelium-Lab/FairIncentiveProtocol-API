import pg from "../config/db";
import { Company, DeleteUser, GetCompany, Property, Stat, UpdateUser, User } from "../entities";

export async function addUser(user: User, getCompany: GetCompany): Promise<string | null> {
    try {
        const trx = await pg.transaction()
        const id: string | null = await trx('users')
            .insert({
                company_id: getCompany.company_id,
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet,
                notes: user.notes
            }, 'id')
            .then(async (ids) => {
                user.properties?.forEach(v => {
                    v.user_id = ids[0].id
                    v.company_id = getCompany.company_id
                })
                user.stats?.forEach(v => {
                    v.user_id = ids[0].id
                    v.company_id = getCompany.company_id
                })
                if (user.properties?.length) await trx('user_properties').insert(user.properties)
                if (user.stats?.length) await trx('user_stats').insert(user.stats)        
                return ids[0].id
            })
            .then(async (id) => {
                await trx.commit()
                return id
            })
            .catch(async (err) => {
                console.log(err)
                await trx.rollback()
                return null
            })
        return id
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
        await pg.raw('DELETE FROM users WHERE company_id=? AND id=?', [getCompany.company_id, deleteUser.id])
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function updateUser(user: UpdateUser, getCompany: GetCompany): Promise<boolean> {
    try {
        await pg('user_properties').where({user_id: user.id, company_id: getCompany.company_id}).delete()
        await pg('user_stats').where({user_id: user.id, company_id: getCompany.company_id}).delete()
        const trx = await pg.transaction()
        const ok: boolean = await trx('users')
            .where({id: user.id})
            .update({
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet,
                notes: user.notes
            })
            .then(async (ids) => {
                user.properties?.forEach(v => {
                    v.user_id = user.id
                    v.company_id = getCompany.company_id
                })
                user.stats?.forEach(v => {
                    v.user_id = user.id
                    v.company_id = getCompany.company_id
                })
                if (user.properties?.length) await trx('user_properties').insert(user.properties)
                if (user.stats?.length) await trx('user_stats').insert(user.stats)        
                return true
            })
            .then(async () => {
                await trx.commit()
                return true
            })
            .catch(async (err) => {
                console.log(err)
                await trx.rollback()
                return false
            })
        return ok
    } catch (error) {
        console.log(error)
        return false
    }
}