import * as joi  from 'joi'
import JoiPhoneNumber from 'joi-phone-number'
import { isAddress } from 'ethers'

const Joi: any = joi.extend(JoiPhoneNumber)

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
        .required()
        .error(new Error('Сompany name is incorrect (name)')),

    email: Joi.string()
        .email()
        .required()
        .error(new Error('Email is incorrect (email)')),

    password: Joi.string()
        .min(8)
        .alphanum()
        .required()
        .error(new Error('Password is incorrect (password)')),

    repeat_password: Joi.ref('password'),

    phone: Joi.string()
        .phoneNumber()
        .error(new Error('Phone is incorrect (phone)')),

    wallet: Joi.string()
        .external(checkAddress)

})

function checkAddress(wallet: string) {
    const _isAddress = isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}