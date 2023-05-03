import Joi  from 'joi'

export const ChangeCompanyName: unknown = {
    $id: 'ChangeCompanyName',
    type: 'object',
    properties: {
        newName: {
            type: 'string'
        }
    }
}

export const ChangeCompanyNameValidation: Joi.ObjectSchema = Joi.object({
    newName: Joi.string()
        .min(3)
        .max(256)
        .required()
})
