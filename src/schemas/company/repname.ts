import Joi  from 'joi'

export const ChangeCompanyRepname: unknown = {
    $id: 'ChangeCompanyRepname',
    type: 'object',
    properties: {
        newRepname: {
            type: 'string'
        }
    }
}

export const ChangeCompanyRepnameValidation: Joi.ObjectSchema = Joi.object({
    newRepname: Joi.string()
        .max(256)
        .required()
})
