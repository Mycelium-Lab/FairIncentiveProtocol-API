"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteApiKeyValidation = exports.DeleteApiKey = void 0;
const joi_1 = __importDefault(require("joi"));
exports.DeleteApiKey = {
    $id: 'DeleteApiKey',
    type: 'object',
    properties: {
        key: {
            type: 'string'
        }
    }
};
exports.DeleteApiKeyValidation = joi_1.default.object({
    key: joi_1.default.string()
        .required()
});
