import { utils } from 'ethers'
import Joi  from 'joi'

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
        chainid: {
            type: 'string'
        }
    }
}

export const AddNFTCollectionValidation: Joi.ObjectSchema = Joi.object({
    address: Joi.string()
        .min(42)
        .max(42)
        .required()
        .external(checkAddress),

    name: Joi.string()
        .required(),

    symbol: Joi.string()
        .required(),

    chainid: Joi.string()
        .required()

})

function checkAddress(wallet: string) {
    const _isAddress = utils.isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}