import * as joi  from 'joi'
import JoiPhoneNumber from 'joi-phone-number'
import { joiPasswordExtendCore } from 'joi-password'
import { checkAddress } from '../utils'

let Joi: any = joi.extend(JoiPhoneNumber, joiPasswordExtendCore)

export const SignUp: unknown = {
    $id: 'SignUpCompany',
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        repeat_password: {
            type: 'string'
        },
        wallet: {
            type: 'string'
        },
        country: {
            type: 'string',
        },
        phone: {
            type: 'string'
        }
    }
}

export const SignUpValidation: joi.ObjectSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(256)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .required(),

    repeat_password: Joi.ref('password'),

    phone: Joi.string()
        .phoneNumber(),

    wallet: Joi.string()
        .allow('')
        .external(checkAddress)
        .required()

})