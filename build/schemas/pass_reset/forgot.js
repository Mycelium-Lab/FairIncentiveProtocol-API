"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassEmailValidation = exports.ForgotPassEmail = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ForgotPassEmail = {
    $id: 'ForgotPassEmail',
    type: 'object',
    properties: {
        email: {
            type: 'string'
        }
    }
};
exports.ForgotPassEmailValidation = joi_1.default.object({
    startDate: joi_1.default.string().email().required()
});
