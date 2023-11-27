import Joi  from 'joi'
import { checkAddress, checkChainID } from '../utils'

export const AddNFT: unknown = {
    $id: 'AddNFT',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        amount: {
            type: ['null', 'number'], nullable: true
        },
        name: {
            type: 'string'
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        properties: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    value: {type: 'string'}
                }
            }
        },
        stats: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    value: {type: 'number'}
                }
            }
        }
    }
}

export const AddNFTValidation: Joi.ObjectSchema = Joi.object({
    address: Joi.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(checkAddress),

    amount: Joi.number().allow(null),

    name: Joi.string().required(),

    description: Joi.string().allow(null),

    chainid: Joi.string()
        .required()
        .external(checkChainID),

    properties: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            value: Joi.string().required(),
        })
    ),

    stats: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            value: Joi.number().required(),
        })
    )

})
