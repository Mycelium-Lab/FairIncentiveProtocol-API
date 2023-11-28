import Joi  from 'joi'

export const Uuid: unknown = {
    $id: 'Uuid',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    }
}

export const UuidValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
})
