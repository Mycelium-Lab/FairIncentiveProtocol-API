import { utils } from 'ethers'
import Joi  from 'joi'

export const AddNFTReward: unknown = {
    $id: 'AddNFTReward',
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        nft_id: {
            type: 'string'
        }
    }
}

export const AddNFTRewardValidation: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),

    description: Joi.string().allow(null, ''),

    nft_id: Joi.string().uuid().required()

})

function checkAddress(wallet: string) {
    const _isAddress = utils.isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}