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
const errors_1 = require("../errors");
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
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? { body: res.body } : { error: res.error });
                }
                else
                    throw Error('Wrong auth token');
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        })),
            app.get('/get/token', {
                onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const token = (0, controller_1.getToken)(req);
                    if (token) {
                        const data = app.jwt.decode(token);
                        const res = yield (0, service_1.getTokenRewards)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                    const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            })),
            app.post('/delete/token', {
                onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
                schema: {
                    body: { $ref: 'Delete' }
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const token = (0, controller_1.getToken)(req);
                    const Delete = req.body;
                    yield schemas_1.DeleteValidation.validateAsync(Delete);
                    if (token) {
                        const data = app.jwt.decode(token);
                        const res = yield (0, service_1.deleteTokenReward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, Delete);
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
                    const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            })),
            app.post('/reward/token', {
                onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
                schema: {
                    body: { $ref: 'RewardWithToken' }
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const token = (0, controller_1.getToken)(req);
                    const reward = req.body;
                    yield schemas_1.RewardWithTokenValidation.validateAsync(reward);
                    if (token) {
                        const data = app.jwt.decode(token);
                        const res = yield (0, service_1.rewardWithToken)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward);
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
                    const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            })),
            app.get('/events/tokens', {
                onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const token = (0, controller_1.getToken)(req);
                    if (token) {
                        const data = app.jwt.decode(token);
                        const res = yield (0, service_1.getRewardTokenEvents)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                    const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            }));
        app.post('/add/nft', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'AddNFTReward' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const nftReward = req.body;
                yield schemas_1.AddNFTRewardValidation.validateAsync(nftReward);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.addNFTReward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, nftReward);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/get/nfts', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.getNFTRewards)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/delete/nfts', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'Delete' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const Delete = req.body;
                yield schemas_1.DeleteValidation.validateAsync(Delete);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.deleteNFTReward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, Delete);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/reward/nft', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'RewardWithToken' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const reward = req.body;
                yield schemas_1.RewardWithTokenValidation.validateAsync(reward);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.rewardWithNFT)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/events/nfts', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.getRewardNFTEvents)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/events/claimabletoken', (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const res = yield (0, service_1.getClaimableToken)(query.id, query.user_id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/events/claimablenft', (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const res = yield (0, service_1.getClaimableNFT)(query.id, query.user_id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/update/token', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'UpdateTokenReward' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const update = req.body;
                yield schemas_1.UpdateTokenRewardValidation.validateAsync(update);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.updateTokenReward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, update);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/update/nft', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'UpdateNFTReward' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const update = req.body;
                yield schemas_1.UpdateNFTRewardValidation.validateAsync(update);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.updateNFTReward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, update);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/update/status/token', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'Status' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const status = req.body;
                yield schemas_1.StatusValidation.validateAsync(status);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.setTokenRewardStatus)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, status);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/update/status/nft', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'Status' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const status = req.body;
                yield schemas_1.StatusValidation.validateAsync(status);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.setNFTRewardStatus)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, status);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/delete/events/token', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const tokenRewardEvent = req.body;
                yield schemas_1.DeleteValidation.validateAsync(tokenRewardEvent);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.deleteTokenRewardEvent)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, tokenRewardEvent);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/delete/events/nft', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const nftRewardEvent = req.body;
                yield schemas_1.DeleteValidation.validateAsync(nftRewardEvent);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.deleteNFTRewardEvent)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, nftRewardEvent);
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
                const prettyError = (0, errors_1.prettyRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.rewardsPlugin = rewardsPlugin;
