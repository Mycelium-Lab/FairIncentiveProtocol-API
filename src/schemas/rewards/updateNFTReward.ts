import Joi  from 'joi'

export const UpdateNFTReward: unknown = {
    $id: 'UpdateNFTReward',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: ['null', 'string'], nullable: true
        },
        description: {
            type: ['null', 'string'], nullable: true
        },
        nft_id: {
            type: ['null', 'number'], nullable: true
        }
    }
}

export const UpdateNFTRewardValidation: Joi.ObjectSchema = Joi.object({
    
    id: Joi.string().uuid().required(),

    name: Joi.string().allow(null),

    description: Joi.string().allow(null),

    nft_id: Joi.string().uuid().allow(null)

})
