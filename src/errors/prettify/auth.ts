import { ErrorResponse } from "../../entities";
import { CODES } from "../../utils/constants";

export function prettyAuthError(errorMessage: string): ErrorResponse {
    if (errorMessage.includes('Not exist')) {
        return {
            code: CODES.NOT_FOUND.code,
            error: {
                name: CODES.NOT_FOUND.name,
                message: "Company not exist with this <email>"
            }
        }
    }
    if (errorMessage.includes("Wrong password")) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                message: "Wrong <password>"
            }
        }
    }
    //means that some field in json is wrong or not exist
    if (errorMessage.includes('\"')) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                message: errorMessage.replace('\"', "<").replace('\"', ">")
            }
        }
    } 
    if (errorMessage.includes('Country code is incorrect (country)')) {
        return {
            code: CODES.BAD_REQUEST.code,
            error: {
                name: CODES.BAD_REQUEST.name,
                message: errorMessage.replace('(', "<").replace(')', ">")
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