import { utils } from 'ethers'
import Joi  from 'joi'
import { checkAddress } from '../utils'

export const AddToken: unknown = {
    $id: 'AddToken',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        symbol: {
            type: 'string'
        },
        chainid: {
            type: 'string'
        }
    }
}

export const AddTokenValidation: Joi.ObjectSchema = Joi.object({
    address: Joi.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(checkAddress),

    name: Joi.string()
        .required(),

    symbol: Joi.string()
        .required(),

    chainid: Joi.string()
        .required()

})
