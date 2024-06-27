import { ErrorResponse } from "../../entities";
import { CODES } from "../../utils/constants";

export function prettyPassResetError(errorMessage: string): ErrorResponse {
    if (errorMessage === "Company with this email does not exist") {
        return {
            code: CODES.NOT_FOUND.code,
            error: {
                name: CODES.NOT_FOUND.name,
                message: "Company with this email does not exist"
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