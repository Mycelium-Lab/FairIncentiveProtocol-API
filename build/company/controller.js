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
function companyPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = getToken(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const company = yield (0, service_1.getCompany)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(200)
                        .send(company);
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.post('/changename', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'ChangeCompanyName' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = getToken(req);
                const updateName = req.body;
                yield schemas_1.ChangeCompanyNameValidation.validateAsync(updateName);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.changeName)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updateName.newName);
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (err) {
                //TODO: pretty company error
                let error = err.message;
                if (error && error.includes('"newName" length must be less than or equal to 256 characters long')) {
                    error = `Company name must be less than or equal to 256 characters in length`;
                }
                reply
                    .code(500)
                    .send({ error });
            }
        }));
        app.post('/changeemail', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'ChangeCompanyEmail' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = getToken(req);
                const updateEmail = req.body;
                yield schemas_1.ChangeCompanyEmailValidation.validateAsync(updateEmail);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.changeEmail)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updateEmail.newEmail);
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.post('/changephone', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'ChangeCompanyPhone' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = getToken(req);
                const updatePhone = req.body;
                yield schemas_1.ChangeCompanyPhoneValidation.validateAsync(updatePhone);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.changePhone)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updatePhone.newPhone);
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.post('/changewallet', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'ChangeCompanyWallet' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = getToken(req);
                const updateWallet = req.body;
                yield schemas_1.ChangeCompanyWalletValidation.validateAsync(updateWallet);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.changeWallet)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updateWallet.newWallet);
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.post('/changepassword', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'ChangeCompanyPassword' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = getToken(req);
                const updatePassword = req.body;
                yield schemas_1.ChangeCompanyPasswordValidation.validateAsync(updatePassword);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.changePassword)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, updatePassword.newPassword);
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                //TODO: pretty company error
                reply
                    .code(500)
                    .send({ message: error.message });
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
