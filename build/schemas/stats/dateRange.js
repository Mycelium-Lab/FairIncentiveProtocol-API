"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRangeValidation = exports.DateRange = void 0;
const joi_1 = __importDefault(require("joi"));
exports.DateRange = {
    $id: 'DateRange',
    type: 'object',
    properties: {
        startDate: {
            type: 'string'
        },
        endData: {
            type: 'string'
        }
    }
};
exports.DateRangeValidation = joi_1.default.object({
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required()
});
