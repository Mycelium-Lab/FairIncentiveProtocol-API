"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyPassResetError = void 0;
const constants_1 = require("../../utils/constants");
function prettyPassResetError(errorMessage) {
    if (errorMessage === "Company with this email does not exist") {
        return {
            code: constants_1.CODES.NOT_FOUND.code,
            error: {
                name: constants_1.CODES.NOT_FOUND.name,
                message: "Company with this email does not exist"
            }
        };
    }
    return {
        code: constants_1.CODES.INTERNAL_ERROR.code,
        error: {
            name: constants_1.CODES.INTERNAL_ERROR.name,
            message: errorMessage
        }
    };
}
exports.prettyPassResetError = prettyPassResetError;
