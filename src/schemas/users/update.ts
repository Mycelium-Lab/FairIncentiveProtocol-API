import Joi  from 'joi'
import { utils } from 'ethers'

export const UpdateUser: unknown = {
    $id: 'UpdateUser',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        external_id: {
            type: ['null', 'string'], nullable: true
        },
        email: {
            type: ['null', 'string'], nullable: true
        },
        wallet: {
            type: ['null', 'string'], nullable: true
        },
        notes: {
            type: ['null', 'string'], nullable: true
        },
        properties: {
            type: 'array',
            items: {
                type: 'object'
            },
            default: []
        },
        stats: {
            type: 'array',
            items: {
                type: 'object'
            },
            default: []
        }
    }
}

export const UpdateUserValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string().uuid().required(),

    external_id: Joi.string()
        .max(256).allow(null, ''),

    email: Joi.string()
        .email().allow(null, ''),

    wallet: Joi.string().allow(null, ''),

    notes: Joi.string().allow(null, ''),

    properties: Joi.array().allow(null),

    stats: Joi.array().allow(null)

})

export function checkAddress(wallet: string) {
    const _isAddress = utils.isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}