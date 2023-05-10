import Joi  from 'joi'

export const DeleteReward: unknown = {
    $id: 'DeleteReward',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    }
}

export const DeleteRewardValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
})
