import Joi from "joi"

export const ForgotPassEmail: unknown = {
    $id: 'ForgotPassEmail',
    type: 'object',
    properties: {
        email: {
            type: 'string'
        }
    }
}

export const ForgotPassEmailValidation: Joi.ObjectSchema = Joi.object({
    startDate: Joi.string().email().required()
})
