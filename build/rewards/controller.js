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
exports.rewardsPlugin = void 0;
const controller_1 = require("../company/controller");
const schemas_1 = require("../schemas");
const service_1 = require("./service");
function rewardsPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/add/token', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'AddTokenReward' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const tokenReward = req.body;
                yield schemas_1.AddTokenRewardValidation.validateAsync(tokenReward);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.addTokenReward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, tokenReward);
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Something wrong with token');
            }
            catch (error) {
                reply
                    .code(500)
                    .send({ message: 'Something went wrong' });
            }
        })),
            app.get('/get/token', {
                onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const token = (0, controller_1.getToken)(req);
                    const tokenReward = req.body;
                    yield schemas_1.AddTokenRewardValidation.validateAsync(tokenReward);
                    if (token) {
                        const data = app.jwt.decode(token);
                        const tokenRewards = yield (0, service_1.getTokenRewards)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                        reply
                            .code(tokenRewards.length ? 200 : 500)
                            .send({ tokenRewards });
                    }
                    else
                        throw Error('Something wrong with token');
                }
                catch (error) {
                    reply
                        .code(500)
                        .send({ tokenRewards: [] });
                }
            }));
    });
}
exports.rewardsPlugin = rewardsPlugin;
