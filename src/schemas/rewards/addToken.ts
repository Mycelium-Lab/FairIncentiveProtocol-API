import { utils } from 'ethers'
import Joi  from 'joi'

export const AddTokenReward: unknown = {
    $id: 'AddTokenReward',
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        address: {
            type: 'string'
        },
        amount: {
            type: 'string'
        }
    }
}

export const AddTokenRewardValidation: Joi.ObjectSchema = Joi.object({
    address: Joi.string()
        .min(42)
        .max(42)
        .required()
        .external(checkAddress),

    description: Joi.string().allow(null),

    name: Joi.string()
        .required(),

    amount: Joi.string()
        .required()

})

function checkAddress(wallet: string) {
    const _isAddress = utils.isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}