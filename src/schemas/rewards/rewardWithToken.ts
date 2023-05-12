import { utils } from 'ethers'
import Joi  from 'joi'

export const RewardWithToken: unknown = {
    $id: 'RewardWithToken',
    type: 'object',
    properties: {
        reward_id: {
            type: 'string'
        },
        user_id: {
            type: 'string'
        },
        comment: {
            type: ['null', 'string'], nullable: true
        }
    }
}

export const RewardWithTokenValidation: Joi.ObjectSchema = Joi.object({
    
    reward_id: Joi.string().uuid().required(),

    user_id: Joi.string().uuid().required(),

    comment: Joi.string().allow(null, '')

})
