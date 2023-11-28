import Joi from "joi"

export const UuidDateRange: unknown = {
    $id: 'UuidDateRange',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        startDate: {
            type: 'string'
        },
        endData: {
            type: 'string'
        }
    }
}

export const UuidDateRangeValidation: Joi.ObjectSchema = Joi.object({
    id: Joi.string().uuid().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})
