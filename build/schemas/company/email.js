"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCompanyEmailValidation = exports.ChangeCompanyEmail = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ChangeCompanyEmail = {
    $id: 'ChangeCompanyEmail',
    type: 'object',
    properties: {
        newEmail: {
            type: 'string'
        }
    }
};
exports.ChangeCompanyEmailValidation = joi_1.default.object({
    newEmail: joi_1.default.string()
        .email()
        .required(),
});
