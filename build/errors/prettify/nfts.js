"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyNFTError = void 0;
const constants_1 = require("../../utils/constants");
function prettyNFTError(errorMessage) {
    if (errorMessage.includes("\"address\" length must be less than or equal to 42 characters long")
        ||
            errorMessage.includes('\"address\" length must be at least 42 characters long')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: '<address> length must be 42 characters long'
            }
        };
    }
    if (errorMessage.includes('Wallet is incorrect (address)')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: '<address> has the wrong format'
            }
        };
    }
    if (errorMessage.includes("Wallet can't be null")) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                message: '<address> cannot be null'
            }
        };
    }
    if (errorMessage.includes('\"')) {
        return {
            code: constants_1.CODES.BAD_REQUEST.code,
            error: {
                name: constants_1.CODES.BAD_REQUEST.name,
                //ex: \"chainid\" is not allowed changes to <chainid>
                message: errorMessage.replace('\"', "<").replace('\"', ">")
            }
        };
    }
    if (errorMessage.includes("The collection with this company and address was not found")) {
        return {
            code: constants_1.CODES.NOT_FOUND.code,
            error: {
                name: constants_1.CODES.NOT_FOUND.name,
                message: errorMessage
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
exports.prettyNFTError = prettyNFTError;
