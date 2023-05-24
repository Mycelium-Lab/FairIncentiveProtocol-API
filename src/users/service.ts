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
                pg.raw(`
                    ARRAY(
                        SELECT JSON_BUILD_OBJECT('name', user_properties.name, 'value', user_properties.value)
                        FROM user_properties
                        WHERE user_properties.user_id = users.id
                        AND user_properties.name IS NOT NULL
                    ) as properties
                `),
                pg.raw(`
                    ARRAY(
                        SELECT JSON_BUILD_OBJECT('name', user_stats.name, 'value', user_stats.value)
                        FROM user_stats
                        WHERE user_stats.user_id = users.id
                        AND user_stats.name IS NOT NULL
                    ) as stats
                `),
                pg.raw(`
                    ARRAY (
                        SELECT JSON_BUILD_OBJECT(
                            'reward_name', rewards_erc721.name,
                            'nft_name', nfts.name,
                            'collection_name', erc721_tokens.name,
                            'count', COUNT(*)
                        )
                        FROM reward_event_erc721
                        LEFT JOIN rewards_erc721 ON rewards_erc721.id = reward_event_erc721.reward_id
                        LEFT JOIN nfts ON nfts.id = rewards_erc721.nft_id
                        LEFT JOIN erc721_tokens ON erc721_tokens.address = nfts.address
                        WHERE reward_event_erc721.user_id = users.id
                        GROUP BY rewards_erc721.name, nfts.name, erc721_tokens.name
                    ) as nft_rewards
                `),
                pg.raw(`
                    ARRAY (
                        SELECT JSON_BUILD_OBJECT(
                            'token_name', erc20_tokens.name,
                            'reward_name', rewards_erc20.name,
                            'count', COUNT(*)
                        )
                        FROM reward_event_erc20
                        LEFT JOIN rewards_erc20 ON rewards_erc20.id = reward_event_erc20.reward_id
                        LEFT JOIN erc20_tokens ON erc20_tokens.address = rewards_erc20.address
                        WHERE reward_event_erc20.user_id = users.id
                        GROUP BY erc20_tokens.name, rewards_erc20.name
                    ) as token_rewards
                `)
            ])
            .leftJoin('user_properties', 'users.id', '=', 'user_properties.user_id')
            .leftJoin('user_stats', 'users.id', '=', 'user_stats.user_id')
            .whereRaw('users.company_id = ?', [getCompany.company_id])
            .groupBy([
                'users.id', 'users.company_id', 'users.external_id', 'users.email', 'users.wallet', 'users.image', 'users.notes'
            ]);
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