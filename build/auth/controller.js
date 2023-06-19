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
exports.authPlugin = void 0;
const schemas_1 = require("../schemas");
const service_1 = require("./service");
const service_2 = require("../company/service");
const errors_1 = require("../errors");
function authPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/signup', {
            schema: {
                body: { $ref: 'SignUpCompany' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                yield schemas_1.SignUpValidation.validateAsync(body);
                const res = yield (0, service_2.createCompany)(body);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyAuthError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        })),
            app.post('/signin', {
                schema: {
                    body: { $ref: 'SignInCompany' }
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = req.body;
                    yield schemas_1.SignInValidation.validateAsync(body);
                    const res = yield (0, service_1.checkCompany)(body);
                    //create token if OK
                    if ('body' in res) {
                        const payload = { email: body.email, company_id: res.body.data.company_id, company: true, address: res.body.data.address };
                        res.body.data.token = app.jwt.sign(payload);
                    }
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? { body: res.body } : { error: res.error });
                }
                catch (error) {
                    console.log(error.message);
                    const prettyError = (0, errors_1.prettyAuthError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            }));
    });
}
exports.authPlugin = authPlugin;
