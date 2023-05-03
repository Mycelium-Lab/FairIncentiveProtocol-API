import * as joi  from 'joi'
import { joiPasswordExtendCore } from 'joi-password'

let Joi: any = joi.extend(joiPasswordExtendCore)

export const ChangeCompanyPassword: unknown = {
    $id: 'ChangeCompanyPassword',
    type: 'object',
    properties: {
        newPassword: {
            type: 'string'
        }
    }
}

export const ChangeCompanyPasswordValidation: joi.ObjectSchema = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .required(),
})
