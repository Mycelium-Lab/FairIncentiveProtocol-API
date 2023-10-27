import Joi from "joi"

export const DateRange: unknown = {
    $id: 'DateRange',
    type: 'object',
    properties: {
        startDate: {
            type: 'string'
        },
        endData: {
            type: 'string'
        }
    }
}

export const DateRangeValidation: Joi.ObjectSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})
