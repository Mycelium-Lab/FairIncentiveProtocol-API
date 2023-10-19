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
exports.getToken = exports.companyPlugin = void 0;
const service_1 = require("./service");
const schemas_1 = require("../schemas");
const errors_1 = require("../errors");
const response_description_1 = require("../response_description");
function companyPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.companyResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.getCompany)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyCompanyError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/changename', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'ChangeCompanyName' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.changeNameResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateName = req.body;
                yield schemas_1.ChangeCompanyNameValidation.validateAsync(updateName);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.changeName)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updateName.newName);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyCompanyError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/changeemail', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'ChangeCompanyEmail' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.changeEmailResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEmail = req.body;
                yield schemas_1.ChangeCompanyEmailValidation.validateAsync(updateEmail);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.changeEmail)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updateEmail.newEmail);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyCompanyError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/changephone', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'ChangeCompanyPhone' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.changePhoneResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatePhone = req.body;
                yield schemas_1.ChangeCompanyPhoneValidation.validateAsync(updatePhone);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.changePhone)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updatePhone.newPhone);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyCompanyError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/changewallet', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'ChangeCompanyWallet' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.changeWalletResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateWallet = req.body;
                yield schemas_1.ChangeCompanyWalletValidation.validateAsync(updateWallet);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.changeWallet)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updateWallet.newWallet);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyCompanyError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/changepassword', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'ChangeCompanyPassword' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.changePasswordResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatePassword = req.body;
                yield schemas_1.ChangeCompanyPasswordValidation.validateAsync(updatePassword);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.changePassword)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updatePassword.newPassword);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyCompanyError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/changerepname', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'ChangeCompanyRepname' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.changeRepnameResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateRepname = req.body;
                yield schemas_1.ChangeCompanyRepnameValidation.validateAsync(updateRepname);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.changeRepname)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updateRepname.newRepname);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyCompanyError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.companyPlugin = companyPlugin;
function getToken(req) {
    const headers = req.headers['authorization'];
    const token = headers === null || headers === void 0 ? void 0 : headers.split(' ')[1];
    return token;
}
exports.getToken = getToken;
