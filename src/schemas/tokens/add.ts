import Joi, { number }  from 'joi'
import { checkAddress, checkChainID } from '../utils'

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
        },
        supply_type: {
            type: 'number'
        },
        max_supply: {
            type: ['null', 'string'], nullable: true
        },
        initial_supply: {
            type: ['null', 'string'], nullable: true
        },
        pausable: {
            type: 'boolean',
            default: false
        },
        burnable: {
            type: 'boolean',
            default: false
        },
        blacklist: {
            type: 'boolean',
            default: false
        },
        recoverable: {
            type: 'boolean',
            default: false
        },
        verified: {
            type: 'boolean',
            default: false
        },
        fpmanager: {
            type: 'string'
        },
        image: {
            type: ['null', 'string'], nullable: true
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
        .external(checkChainID),

    supply_type: Joi.number().min(0).max(2).required(),

    //only digits 
    //not number type because can be too big (uint256)
    max_supply: Joi.string().pattern(/^\d+$/).allow(null),

    //only digits 
    initial_supply: Joi.string().pattern(/^\d+$/).allow(null),

    pausable: Joi.boolean().required(),

    burnable: Joi.boolean().required(),

    blacklist: Joi.boolean().required(),

    recoverable: Joi.boolean().required(),

    verified: Joi.boolean().required(),

    fpmanager: Joi.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(checkAddress),

    image: Joi.string().allow(null)

})
