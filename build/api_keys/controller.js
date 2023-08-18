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
exports.apiKeysPlugin = void 0;
const errors_1 = require("../errors");
const schemas_1 = require("../schemas");
const service_1 = require("./service");
function apiKeysPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/', {
            preHandler: app.authenticate
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.getApiKeys)(data);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyApiKeysError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/create', {
            preHandler: app.authenticate
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const randomNumber = Math.random();
                const key = app.jwt.sign(Object.assign(Object.assign({}, data), { randomNumber }));
                const res = yield (0, service_1.createApiKey)(data, key);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyApiKeysError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/delete', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'DeleteApiKey' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const key = req.body;
                yield schemas_1.DeleteApiKeyValidation.validateAsync(key);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.deleteApiKey)(data, key.key);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyApiKeysError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.apiKeysPlugin = apiKeysPlugin;
