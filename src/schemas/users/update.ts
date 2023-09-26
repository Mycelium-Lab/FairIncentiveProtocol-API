import Joi  from 'joi'
import { checkAddress } from '../utils'

export const UpdateUser: unknown = {
    $id: 'UpdateUser',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        company_id: {
            type: ['null', 'string'], nullable: true
        },
        external_id: {
            type: ['null', 'string'], nullable: true
        },
        email: {
            type: ['null', 'string'], nullable: true
        },
        wallet: {
            type: ['null', 'string'], nullable: true
        },
        notes: {
            type: ['null', 'string'], nullable: true
        },
        image: {
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

export const UpdateUserValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string().uuid().required(),

    company_id: Joi.string().uuid().allow(null),

    external_id: Joi.string()
        .max(256).allow(null),

    email: Joi.string()
        .email().allow(null),

    wallet: Joi.string().allow(null).external(checkAddress),

    notes: Joi.string().allow(null),

    image: Joi.string().allow(null),

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
