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
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const jwtMiddleware = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.jwtVerify();
        const token = getToken(req);
        if (token) {
            const data = app.jwt.decode(token);
            req.jwtData = data; // Добавляем декодированные данные в объект запроса
        }
        else {
            throw new Error('Wrong auth token');
        }
    }
    catch (error) {
        console.log(error.message);
        const prettyError = (0, errors_1.prettyCompanyError)(error.message);
        reply
            .code(prettyError.code)
            .type('application/json; charset=utf-8')
            .send({ error: prettyError.error });
    }
});
function getToken(req) {
    const headers = req.headers['authorization'];
    const token = headers === null || headers === void 0 ? void 0 : headers.split(' ')[1];
    return token;
}
app.addHook('preHandler', jwtMiddleware);
