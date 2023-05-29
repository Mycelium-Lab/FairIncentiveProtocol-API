import Joi  from 'joi'
import { checkAddress, checkChainID } from '../utils'

export const AddNFTCollection: unknown = {
    $id: 'AddNFTCollection',
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
        description: {
            type: ['null', 'string'], nullable: true
        },
        chainid: {
            type: 'string'
        },
        beneficiary: {
            type: ['null', 'string'], nullable: true
        },
        royalties: {
            type: 'number'
        },
        links: {
            type: 'array',
            items: {
                type: 'object'
            },
            default: []
        }
    }
}

export const AddNFTCollectionValidation: Joi.ObjectSchema = Joi.object({
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

    description: Joi.string().allow(null).max(1000),

    chainid: Joi.string()
        .required()
        .external(checkChainID),
    
    beneficiary: Joi.string().allow(null).external(checkAddress),

    royalties: Joi.number().required(),

    links: Joi.array().allow(null)

})
