import { ErrorResponse } from "../../entities";
import { CODES } from "../../utils/constants";

export function prettyNFTError(errorMessage: string): ErrorResponse {
    if (errorMessage.includes("image cannot be null")) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                message: errorMessage
            }
        }
    }
    if (
        errorMessage.includes("\"address\" length must be less than or equal to 42 characters long")
        || 
        errorMessage.includes('\"address\" length must be at least 42 characters long')
    ) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                message:  '<address> length must be 42 characters long'
            }
        }
    }
    if (errorMessage.includes('Wallet is incorrect (address)')) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                message:  '<address> has the wrong format'
            }
        }
    }
    if (errorMessage.includes("Wallet can't be null")) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                message:  '<address> cannot be null'
            }
        }
    }
    if (errorMessage.includes('\"')) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                //ex: \"chainid\" is not allowed changes to <chainid>
                message: errorMessage.replace('\"', "<").replace('\"', ">")
            }
        }
    }
    if (errorMessage.includes("The collection with this company and address was not found")) {
        return {
            code: CODES.NOT_FOUND.code,
            error: {
                name: CODES.NOT_FOUND.name,
                message: errorMessage
            }
        }
    }
    return {
        code: CODES.INTERNAL_ERROR.code,
        error: {
            name: CODES.INTERNAL_ERROR.name,
            message: errorMessage
        }
    }
}