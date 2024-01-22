import Joi from "joi"
import { checkAddress, checkChainID } from "../utils"

export const TokenForDist: unknown = {
    $id: 'TokenForDist',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        chainid: {
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

export const TokenForDistValidation: Joi.ObjectSchema = Joi.object({
    address: Joi.string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(checkAddress),
    chainid: Joi.string()
        .required()
        .external(checkChainID),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})
