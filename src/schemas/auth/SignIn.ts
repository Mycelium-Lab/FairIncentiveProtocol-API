import * as joi  from 'joi'
import JoiPhoneNumber from 'joi-phone-number'

const Joi: any = joi.extend(JoiPhoneNumber)

export const SignIn: unknown = {
    $id: 'SignInCompany',
    type: 'object',
    properties: {
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        phone: {
            type: 'string'
        }
    }
}

export const SignInValidation: joi.ObjectSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .error(new Error('Email is incorrect (email)')),

    password: Joi.string()
        .min(8)
        .alphanum()
        .required()
        .error(new Error('Password is incorrect (password)')),

    phone: Joi.string()
        .phoneNumber()
        .error(new Error('Phone is incorrect (phone)'))
})
