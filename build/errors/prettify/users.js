"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyUsersError = void 0;
const constants_1 = require("../../utils/constants");
function prettyUsersError(errorMessage) {
    if (errorMessage.includes("Wallet can't be null (wallet)")) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: "<wallet> can't be null"
            }
        };
    }
    if (errorMessage.includes("Wallet is incorrect (wallet)")) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: "<wallet> is incorrect"
            }
        };
    }
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
exports.prettyUsersError = prettyUsersError;
