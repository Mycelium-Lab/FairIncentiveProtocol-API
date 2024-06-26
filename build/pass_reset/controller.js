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
exports.passResetPlugin = void 0;
const service_1 = require("./service");
const errors_1 = require("../errors");
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const config_1 = require("../config/config");
const constants_1 = require("../utils/constants");
const mailgun = new mailgun_js_1.default(form_data_1.default);
const mg = mailgun.client({ username: 'api', key: config_1.config.MAILGUN_API_KEY });
function passResetPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/forgot', {
            schema: {
                body: { $ref: 'ForgotPassEmail' },
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const companyChecker = yield (0, service_1.checkCompanyOnThisEmailExist)(body.email);
                if (!companyChecker) {
                    const res = (0, errors_1.prettyPassResetError)('Company with this email does not exist');
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: res.error });
                }
                else {
                    const jwtPayload = { email: body.email, company_id: companyChecker.id, company: true, address: companyChecker.wallet };
                    const signatureForReset = app.jwt.sign(jwtPayload, { expiresIn: '600s' });
                    const msg = yield mg.messages.create(config_1.config.MAILGUN_DOMAIN, {
                        from: `Password Recover <${config_1.config.MAILGUN_USER}>`,
                        to: [body.email],
                        subject: "Fair Protocol password recovery",
                        text: "Password recovery",
                        html: `<a href="http://localhost:3001/?tokenreset=${signatureForReset}" rel="noreferrer" target="_blank">Reset Password</a>`
                    });
                    console.log(msg);
                    const res = {
                        code: constants_1.CODES.OK.code,
                        body: {
                            message: 'The email was successfully sent',
                            type: constants_1.SuccessResponseTypes.string
                        }
                    };
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send({ body: res.body });
                }
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyPassResetError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.passResetPlugin = passResetPlugin;
