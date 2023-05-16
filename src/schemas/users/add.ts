import * as joi  from 'joi'
import JoiPhoneNumber from 'joi-phone-number'
import { utils } from 'ethers'

let Joi: any = joi.extend(JoiPhoneNumber)

export const AddUser: unknown = {
    $id: 'AddUser',
    type: 'object',
    properties: {
        external_id: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        wallet: {
            type: 'string'
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

export const AddUserValidation: joi.ObjectSchema = Joi.object({
    external_id: Joi.string()
        .max(256)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    wallet: Joi.string()
        .external(checkAddress)
        .required(),

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