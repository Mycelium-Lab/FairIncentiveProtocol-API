import Joi from 'joi'

export const DeleteUser: unknown = {
    $id: 'DeleteUser',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    }
}

export const DeleteUserValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string()
        .required(),
})
