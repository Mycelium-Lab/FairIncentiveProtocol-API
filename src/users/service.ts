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
        const users: Array<User> = await pg('users')
            .select([
                'users.id as id', 'users.company_id as company_id',
                'users.external_id as external_id', 'users.email as email',
                'users.wallet as wallet', 'users.image as image', 'users.notes as notes',
                pg.raw('JSON_AGG(JSON_BUILD_OBJECT(\'name\', user_properties.name, \'value\', user_properties.value)) as properties'),
                pg.raw('JSON_AGG(JSON_BUILD_OBJECT(\'name\', user_stats.name, \'value\', user_stats.value)) as stats')
            ])
            .leftJoin('user_properties', 'users.id', '=', 'user_properties.user_id')
            .leftJoin('user_stats', 'users.id', '=', 'user_stats.user_id')
            .whereRaw('users.company_id = ?', [getCompany.company_id])
            .groupBy('users.id', 'users.company_id', 'users.external_id', 'users.email', 'users.wallet', 'users.image', 'users.notes');
        const formattedUsers = users.map(user => {
            const uniquePropertiesMap = new Map(); // Map для отслеживания уникальных свойств
            user.properties = user.properties?.filter(property => {
                if (property.name !== null && !uniquePropertiesMap.has(property.name)) {
                uniquePropertiesMap.set(property.name, true);
                return true;
                }
                return false;
            });
            const uniqueStatsMap = new Map(); // Map для отслеживания уникальных свойств
            user.stats = user.stats?.filter(stat => {
                if (stat.name !== null && !uniqueStatsMap.has(stat.name)) {
                uniqueStatsMap.set(stat.name, true);
                return true;
                }
                return false;
            });
            return user
        });
        return formattedUsers
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