import * as joi  from 'joi'
import JoiPhoneNumber from 'joi-phone-number'
import { isAddress } from 'ethers'

let Joi: any = joi.extend(JoiPhoneNumber)

export const AddUser: unknown = {
    $id: 'AddUser',
    type: 'object',
    properties: {
        firstname: {
            type: 'string'
        },
        lastname: {
            type: 'string'
        },
        patronymic: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        wallet: {
            type: 'string'
        }
    }
}

export const AddUserValidation: joi.ObjectSchema = Joi.object({
    firstname: Joi.string()
        .max(256)
        .required(),

    lastname: Joi.string(),

    patronymic: Joi.string(),

    email: Joi.string()
        .email()
        .required(),

    wallet: Joi.string()
        .external(checkAddress)
        .required()

})

function checkAddress(wallet: string) {
    const _isAddress = isAddress(wallet)
    if (!_isAddress) {
        throw Error('Wallet is incorrect')
    }
}