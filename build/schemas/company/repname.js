"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCompanyRepnameValidation = exports.ChangeCompanyRepname = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ChangeCompanyRepname = {
    $id: 'ChangeCompanyRepname',
    type: 'object',
    properties: {
        newRepname: {
            type: 'string'
        }
    }
};
exports.ChangeCompanyRepnameValidation = joi_1.default.object({
    newRepname: joi_1.default.string()
        .max(256)
        .required()
});
