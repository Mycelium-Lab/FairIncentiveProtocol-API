import Joi  from 'joi'
import { checkAddress } from '../users/add'

export const UpdateTokenReward: unknown = {
    $id: 'UpdateTokenReward',
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
        address: {
            type: ['null', 'string'], nullable: true
        },
        amount: {
            type: ['null', 'number'], nullable: true
        }
    }
}

export const UpdateTokenRewardValidation: Joi.ObjectSchema = Joi.object({
    
    id: Joi.string().uuid().required(),

    name: Joi.string().allow(null, ''),

    description: Joi.string().allow(null, ''),

    address: Joi.string().allow(null, '').external(checkAddress),

    amount: Joi.number().allow(null, '')

})