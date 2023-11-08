"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyStatTokensError = void 0;
const constants_1 = require("../../utils/constants");
function prettyStatTokensError(errorMessage) {
    //means that some field in json is wrong or not exist
    if (errorMessage.includes('\"')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: errorMessage.replace('\"', "<").replace('\"', ">")
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
exports.prettyStatTokensError = prettyStatTokensError;
