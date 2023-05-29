import { ErrorResponse } from "../../entities";
import { CODES } from "../../utils/constants";

export function prettyRewardsError(errorMessage: string): ErrorResponse {
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
    return {
        code: CODES.INTERNAL_ERROR.code,
        error: {
            name: CODES.INTERNAL_ERROR.name,
            message: errorMessage
        }
    }
}