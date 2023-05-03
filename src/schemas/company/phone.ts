import * as joi  from 'joi'
import JoiPhoneNumber from 'joi-phone-number'

let Joi: any = joi.extend(JoiPhoneNumber)

export const ChangeCompanyPhone: unknown = {
    $id: 'ChangeCompanyPhone',
    type: 'object',
    properties: {
        newPhone: {
            type: 'string'
        }
    }
}

export const ChangeCompanyPhoneValidation: joi.ObjectSchema = Joi.object({
    newPhone: Joi.string()
        .phoneNumber(),
})
