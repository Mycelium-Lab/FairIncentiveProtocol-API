import Joi from "joi"
import { checkAddress, checkChainID } from "../utils"

export const GetOneCollectionNft: unknown = {
    $id: 'GetOneCollectionNft',
    type: 'object',
    properties: {
        address: {
            type: 'string'
        },
        chainid: {
            type: 'string'
        }
    }
}

export const GetOneCollectionNftValidation: Joi.ObjectSchema = Joi.object({
    address: Joi
        .string()
        .min(42)
        .max(42)
        .allow('')
        .required()
        .external(checkAddress),
    
    chainid: Joi
        .string()
        .required()
        .external(checkChainID),
})