import Joi  from 'joi'

export const Delete: unknown = {
    $id: 'Delete',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    }
}

export const DeleteValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
})
