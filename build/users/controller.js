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
exports.usersPlugin = void 0;
const schemas_1 = require("../schemas");
const controller_1 = require("../company/controller");
const service_1 = require("./service");
const errors_1 = require("../errors");
function usersPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/add', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'AddUser' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                yield schemas_1.AddUserValidation.validateAsync(user);
                const token = (0, controller_1.getToken)(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.addUser)(user, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                const prettyError = (0, errors_1.prettyUsersError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        })),
            app.get('/', {
                onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const token = (0, controller_1.getToken)(req);
                    if (token) {
                        const data = app.jwt.decode(token);
                        const res = yield (0, service_1.getUsers)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                    const prettyError = (0, errors_1.prettyUsersError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            })),
            app.post('/delete', {
                onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
                schema: {
                    body: { $ref: 'Delete' }
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.body;
                    yield schemas_1.DeleteValidation.validateAsync(user);
                    const token = (0, controller_1.getToken)(req);
                    if (token) {
                        const data = app.jwt.decode(token);
                        const res = yield (0, service_1.deleteUser)(user, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                    const prettyError = (0, errors_1.prettyUsersError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            }));
        app.post('/update', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'UpdateUser' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                yield schemas_1.UpdateUserValidation.validateAsync(user);
                const token = (0, controller_1.getToken)(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.updateUser)(user, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                const prettyError = (0, errors_1.prettyUsersError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.usersPlugin = usersPlugin;
