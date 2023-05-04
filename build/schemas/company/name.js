"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCompanyNameValidation = exports.ChangeCompanyName = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ChangeCompanyName = {
    $id: 'ChangeCompanyName',
    type: 'object',
    properties: {
        newName: {
            type: 'string'
        }
    }
};
exports.ChangeCompanyNameValidation = joi_1.default.object({
    newName: joi_1.default.string()
        .min(3)
        .max(256)
        .required()
});
