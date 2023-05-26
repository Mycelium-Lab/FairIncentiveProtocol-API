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
        .max(256)
        .required()
})
