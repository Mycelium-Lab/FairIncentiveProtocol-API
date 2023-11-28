"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardOneStatValidation = exports.RewardOneStat = void 0;
const joi_1 = __importDefault(require("joi"));
exports.RewardOneStat = {
    $id: 'RewardOneStat',
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    }
};
exports.RewardOneStatValidation = joi_1.default.object({
    id: joi_1.default.string().uuid().required()
});
