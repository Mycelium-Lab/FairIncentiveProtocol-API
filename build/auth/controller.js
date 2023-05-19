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
                const serviceReply = yield (0, service_2.createCompany)(body);
                reply
                    .code(serviceReply.code)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(serviceReply.res);
            }
            catch (error) {
                //TODO: use pretty authError
                if (error.message.includes('repeat_password')) {
                    error.message = 'Repeated password is incorrect (repeat_password)';
                }
                reply
                    .code(400)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send({
                    message: error.message
                });
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
                    const serviceReply = yield (0, service_1.checkCompany)(body);
                    //create token if OK
                    const payload = { email: body.email, phone: body.phone, company_id: serviceReply.data.company_id, company: true, address: serviceReply.data.address };
                    if (!serviceReply.isError)
                        serviceReply.res.message = app.jwt.sign(payload);
                    reply
                        .code(serviceReply.code)
                        .header('Content-Type', 'application/json; charset=utf-8')
                        .send(serviceReply.res);
                }
                catch (error) {
                    //TODO: use pretty authError
                    reply
                        .code(400)
                        .header('Content-Type', 'application/json; charset=utf-8')
                        .send({
                        message: error.message
                    });
                }
            }));
    });
}
exports.authPlugin = authPlugin;
