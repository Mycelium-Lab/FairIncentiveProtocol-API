import Joi  from 'joi'

export const ChangeCompanyEmail: unknown = {
    $id: 'ChangeCompanyEmail',
    type: 'object',
    properties: {
        newEmail: {
            type: 'string'
        }
    }
}

export const ChangeCompanyEmailValidation: Joi.ObjectSchema = Joi.object({
    newEmail: Joi.string()
        .email()
        .required(),
})
