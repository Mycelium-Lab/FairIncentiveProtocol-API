"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyAuthError = void 0;
const constants_1 = require("../../utils/constants");
function prettyAuthError(errorMessage) {
    if (errorMessage.includes("Wrong auth token")) {
        return {
            code: constants_1.CODES.UNAUTHORIZED.code,
            error: {
                name: constants_1.CODES.UNAUTHORIZED.name,
                message: "Wrong auth token"
            }
        };
    }
    if (errorMessage.includes('""phone""')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: "<phone> did not seem to be a phone number"
            }
        };
    }
    if (errorMessage.includes('Not exist')) {
        return {
            code: constants_1.CODES.NOT_FOUND.code,
            error: {
                name: constants_1.CODES.NOT_FOUND.name,
                message: "Company not exist with this <email>"
            }
        };
    }
    if (errorMessage.includes("Wrong password")) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: "Wrong <password>"
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
    if (errorMessage.includes('Country code is incorrect (country)')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: errorMessage.replace('(', "<").replace(')', ">")
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
exports.prettyAuthError = prettyAuthError;
