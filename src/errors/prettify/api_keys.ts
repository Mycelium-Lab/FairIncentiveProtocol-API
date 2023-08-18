import { ErrorResponse } from "../../entities";
import { CODES } from "../../utils/constants";

export function prettyApiKeysError(errorMessage: string): ErrorResponse {
    return {
        code: CODES.INTERNAL_ERROR.code,
        error: {
            name: CODES.INTERNAL_ERROR.name,
            message: errorMessage
        }
    }
}