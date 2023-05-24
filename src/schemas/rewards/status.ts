import Joi  from 'joi'

export const Status: unknown = {
    $id: 'Status',
    type: 'object',
    properties: {
        reward_id: {
            type: 'string'
        },
        status: {
            type: 'number'
        }
    }
}

export const StatusValidation: Joi.ObjectSchema = Joi.object({
    reward_id: Joi.string().uuid().required(),

    status: Joi.number().min(0).max(1).required()

})
