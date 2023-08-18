"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyApiKeysError = void 0;
const constants_1 = require("../../utils/constants");
function prettyApiKeysError(errorMessage) {
    return {
        code: constants_1.CODES.INTERNAL_ERROR.code,
        error: {
            name: constants_1.CODES.INTERNAL_ERROR.name,
            message: errorMessage
        }
    };
}
exports.prettyApiKeysError = prettyApiKeysError;
