import pg from "../config/db";
import { Company, DeleteUser, ErrorResponse, GetCompany, Property, Stat, SuccessResponse, UpdateUser, User } from "../entities";
import { CODES, SuccessResponseTypes } from "../utils/constants";

export async function addUser(user: User, getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        //Using a transaction, because we want to add properties and statistics that 
        //relate to this user because we don't want to lose anything
        const trx = await pg.transaction()
        const _user: User | string = await trx('users')
            .insert({
                company_id: getCompany.company_id,
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet,
                notes: user.notes,
                image: user.image
            }, '*')
            .then(async (_user) => {
                user.properties?.forEach(v => {
                    v.user_id = _user[0].id
                    v.company_id = getCompany.company_id
                })
                user.stats?.forEach(v => {
                    v.user_id = _user[0].id
                    v.company_id = getCompany.company_id
                })
                if (user.properties?.length) await trx('user_properties').insert(user.properties)
                if (user.stats?.length) await trx('user_stats').insert(user.stats)        
                return _user[0]
            })
            .then(async (_user) => {
                await trx.commit()
                return _user
            })
            .catch(async (err) => {
                await trx.rollback()
                return err.message
            })
        //If there is no error
        if (!(_user instanceof String)) {
            const res: SuccessResponse = {
                code: CODES.OK.code,
                body: {
                    message: 'The user was successfully added',
                    type: SuccessResponseTypes.object,
                    data: _user
                }
            }
            return res
        } else {
            const err: ErrorResponse = {
                code: CODES.INTERNAL_ERROR.code,
                error: {
                    name: CODES.INTERNAL_ERROR.name,
                    message: _user.toString()
                }
            }
            return err
        }
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

export async function getUsers(getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
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
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'Users',
                type: SuccessResponseTypes.array,
                data: users
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

export async function deleteUser(deleteUser: DeleteUser, getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg.raw('DELETE FROM users WHERE company_id=? AND id=?', [getCompany.company_id, deleteUser.id])
        const res: SuccessResponse = {
            code: CODES.OK.code,
            body: {
                message: 'The user was successfully deleted',
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

export async function updateUser(user: UpdateUser, getCompany: GetCompany): Promise<ErrorResponse | SuccessResponse> {
    try {
        await pg('user_properties').where({user_id: user.id, company_id: getCompany.company_id}).delete()
        await pg('user_stats').where({user_id: user.id, company_id: getCompany.company_id}).delete()
        const trx = await pg.transaction()
        const updating: string = await trx('users')
            .where({id: user.id, company_id: getCompany.company_id})
            .update({
                external_id: user.external_id,
                email: user.email,
                wallet: user.wallet,
                notes: user.notes
            })
            .then(async () => {
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
            })
            .then(async () => {
                await trx.commit()
                return 'ok'
            })
            .catch(async (err) => {
                await trx.rollback()
                return err.message
            })
        if (updating === 'ok') {
            const res: SuccessResponse = {
                code: CODES.OK.code,
                body: {
                    message: 'User has been successfully updated',
                    type: SuccessResponseTypes.nullType,
                    data: null
                }
            }
            return res
        } else {
            const err: ErrorResponse = {
                code: CODES.INTERNAL_ERROR.code,
                error: {
                    name: CODES.INTERNAL_ERROR.name,
                    message: updating
                }
            }
            return err
        }
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