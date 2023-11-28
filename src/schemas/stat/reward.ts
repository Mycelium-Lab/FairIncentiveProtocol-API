import Joi from "joi"

export const RewardOneStat: unknown = {
    $id: 'RewardOneStat',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    }
}

export const RewardOneStatValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string().uuid().required()
})
