"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidDateRangeValidation = exports.UuidDateRange = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UuidDateRange = {
    $id: 'UuidDateRange',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        startDate: {
            type: 'string'
        },
        endData: {
            type: 'string'
        }
    }
};
exports.UuidDateRangeValidation = joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required()
});
