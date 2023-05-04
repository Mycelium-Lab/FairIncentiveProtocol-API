"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyAuthError = void 0;
function prettyAuthError(errorMessage) {
    if (errorMessage.includes('insert into \"companies\" (\"email\", \"name\", \"password\", \"phone\", \"wallet\") values ($1, $2, $3, DEFAULT, $4) - duplicate key value violates unique constraint \"companies_email_key\"')) {
        return {
            code: 400,
            message: 'This email already exists in the database'
        };
    }
    if (errorMessage.includes('insert into "companies" ("email", "name", "password", "phone", "wallet") values ($1, $2, $3, DEFAULT, $4) - duplicate key value violates unique constraint "companies_wallet_key"')) {
        return {
            code: 400,
            message: 'This wallet already exists in the database'
        };
    }
    return {
        code: 500,
        message: errorMessage
    };
}
exports.prettyAuthError = prettyAuthError;
