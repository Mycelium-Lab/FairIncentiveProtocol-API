"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyAuthError = void 0;
const constants_1 = require("../../utils/constants");
function prettyAuthError(errorMessage) {
    if (errorMessage === "Wrong auth token, maybe it's deprecated or deleted") {
        return {
            code: constants_1.CODES.UNAUTHORIZED.code,
            error: {
                name: constants_1.CODES.UNAUTHORIZED.name,
                message: "Wrong auth token, maybe it's deprecated or deleted"
            }
        };
    }
    if (errorMessage.includes("Authorization token is invalid: The token signature is invalid.")) {
        return {
            code: constants_1.CODES.UNAUTHORIZED.code,
            error: {
                name: constants_1.CODES.UNAUTHORIZED.name,
                message: "Authorization token is invalid: The token signature is invalid."
            }
        };
    }
    if (errorMessage.includes("No Authorization was found in request.headers")) {
        return {
            code: constants_1.CODES.UNAUTHORIZED.code,
            error: {
                name: constants_1.CODES.UNAUTHORIZED.name,
                message: "No Authorization was found in request.headers"
            }
        };
    }
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
