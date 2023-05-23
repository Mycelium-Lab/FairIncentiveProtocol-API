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
exports.publicPlugin = void 0;
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = __importDefault(require("path"));
function publicPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.register(static_1.default, {
            root: path_1.default.join(__dirname, '../../public')
        });
        app.get('/nft', (req, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.sendFile('claimnft.html');
        }));
        app.get('/token', (req, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.sendFile('claimtoken.html');
        }));
    });
}
exports.publicPlugin = publicPlugin;
