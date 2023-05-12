import { utils } from 'ethers'
import Joi  from 'joi'

export const AddNFT: unknown = {
    $id: 'AddNFT',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        chainid: {
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
        }
    }
}

export const AddNFTValidation: Joi.ObjectSchema = Joi.object({
    address: Joi.string()
        .min(42)
        .max(42)
        .required()
        .external(checkAddress),
        
    chainid: Joi.string()
        .required(),

    amount: Joi.number().allow(null),

    name: Joi.string().required(),

    description: Joi.string().allow(null, '')

})

function checkAddress(wallet: string) {
    const _isAddress = utils.isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}