"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const saltRounds = config_1.config.SALT_ROUNDS;
function hash(password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashed = yield bcrypt_1.default.hash(password, saltRounds);
            return hashed;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.hash = hash;
function compare(password, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const check = yield bcrypt_1.default.compare(password, hash);
            return check;
        }
        catch (error) {
            return null;
        }
    });
}
exports.compare = compare;
