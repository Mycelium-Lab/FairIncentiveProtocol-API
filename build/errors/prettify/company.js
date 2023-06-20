"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyCompanyError = void 0;
const constants_1 = require("../../utils/constants");
function prettyCompanyError(errorMessage) {
    if (errorMessage.includes('duplicate key value violates unique constraint "companies_email_key"')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: 'This <email> already exist'
            }
        };
    }
    if (errorMessage.includes('duplicate key value violates unique constraint "companies_phone_key"')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: 'This <phone> already exist'
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
exports.prettyCompanyError = prettyCompanyError;
