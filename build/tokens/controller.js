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
exports.tokensPlugin = void 0;
const controller_1 = require("../company/controller");
const schemas_1 = require("../schemas");
const service_1 = require("./service");
const errors_1 = require("../errors");
function tokensPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/add', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'AddToken' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const Token = req.body;
                yield schemas_1.AddTokenValidation.validateAsync(Token);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.addToken)(Token, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? { body: res.body } : { error: res.error });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyTokensError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.getTokens)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? { body: res.body } : { error: res.error });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyTokensError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.tokensPlugin = tokensPlugin;
