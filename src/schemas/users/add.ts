import * as joi  from 'joi'
import JoiPhoneNumber from 'joi-phone-number'
import { checkAddress } from '../utils'

let Joi: any = joi.extend(JoiPhoneNumber)

export const AddUser: unknown = {
    $id: 'AddUser',
    type: 'object',
    properties: {
        external_id: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        wallet: {
            type: 'string'
        },
        notes: {
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

export const AddUserValidation: joi.ObjectSchema = Joi.object({
    external_id: Joi.string()
        .max(256)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    wallet: Joi.string()
        .allow('')
        .external(checkAddress)
        .required(),

    notes: Joi.string().allow(null),

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
