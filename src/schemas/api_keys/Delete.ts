import Joi  from 'joi'

export const DeleteApiKey: unknown = {
    $id: 'DeleteApiKey',
    type: 'object',
    properties: {
        key: {
            type: 'string'
        }
    }
}

export const DeleteApiKeyValidation: Joi.ObjectSchema = Joi.object({
    key: Joi.string()
        .required()
})
