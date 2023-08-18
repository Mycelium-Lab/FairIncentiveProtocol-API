import Joi  from 'joi'

export const DeleteApiKey: unknown = {
    $id: 'Delete',
    type: 'object',
    properties: {
        key: {
            type: 'string'
        }
    }
}

export const DeleteApiKeyValidation: Joi.ObjectSchema = Joi.object({
    key: Joi.string()
        .uuid()
        .required()
})
