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
exports.statRewardsController = void 0;
const response_description_1 = require("../../response_description");
const errors_1 = require("../../errors");
const rewards_1 = require("../service/rewards");
const schemas_1 = require("../../schemas");
function statRewardsController(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/total_rewards', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, rewards_1.getTotalCount)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewarded_users', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, rewards_1.getUserCount)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewarded_24h', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, rewards_1.get24hCount)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_distribution', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, rewards_1.getDistribution)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_range', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'DateRange'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const dateRange = req.query;
                dateRange.startDate = new Date(dateRange.startDate);
                dateRange.endDate = new Date(dateRange.endDate);
                yield schemas_1.DateRangeValidation.validateAsync(dateRange);
                const res = yield (0, rewards_1.getRewardEventsRange)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, dateRange);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/total_rewards/erc20', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const reward = req.query;
                yield schemas_1.UuidValidation.validateAsync(reward);
                const res = yield (0, rewards_1.getTotalCountErc20Reward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward.id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/total_rewards/erc721', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const reward = req.query;
                yield schemas_1.UuidValidation.validateAsync(reward);
                const res = yield (0, rewards_1.getTotalCountErc721Reward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward.id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewarded_users/erc20', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const reward = req.query;
                yield schemas_1.UuidValidation.validateAsync(reward);
                const res = yield (0, rewards_1.getUserCountErc20Reward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward.id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewarded_users/erc721', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const reward = req.query;
                yield schemas_1.UuidValidation.validateAsync(reward);
                const res = yield (0, rewards_1.getUserCountErc721Reward)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward.id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewarded_24h/erc20', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const reward = req.query;
                yield schemas_1.UuidValidation.validateAsync(reward);
                const res = yield (0, rewards_1.get24hCountErc20)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward.id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewarded_24h/erc721', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'Uuid'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const reward = req.query;
                yield schemas_1.UuidValidation.validateAsync(reward);
                const res = yield (0, rewards_1.get24hCountErc721)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, reward.id);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_range/erc20', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const dateRange = req.query;
                dateRange.startDate = new Date(dateRange.startDate);
                dateRange.endDate = new Date(dateRange.endDate);
                yield schemas_1.UuidDateRangeValidation.validateAsync(dateRange);
                const res = yield (0, rewards_1.getRewardEventsRangeErc20)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, dateRange);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_range/erc721', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const dateRange = req.query;
                dateRange.startDate = new Date(dateRange.startDate);
                dateRange.endDate = new Date(dateRange.endDate);
                yield schemas_1.UuidDateRangeValidation.validateAsync(dateRange);
                const res = yield (0, rewards_1.getRewardEventsRangeErc721)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, dateRange);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_distribution/erc20', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const dateRange = req.query;
                dateRange.startDate = new Date(dateRange.startDate);
                dateRange.endDate = new Date(dateRange.endDate);
                yield schemas_1.UuidDateRangeValidation.validateAsync(dateRange);
                const res = yield (0, rewards_1.getTotalRewardsDistributionErc20)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, dateRange);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_distribution/erc721', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const dateRange = req.query;
                dateRange.startDate = new Date(dateRange.startDate);
                dateRange.endDate = new Date(dateRange.endDate);
                yield schemas_1.UuidDateRangeValidation.validateAsync(dateRange);
                const res = yield (0, rewards_1.getTotalRewardsDistributionErc721)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, dateRange);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_distribution/erc721/user', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const dateRange = req.query;
                dateRange.startDate = new Date(dateRange.startDate);
                dateRange.endDate = new Date(dateRange.endDate);
                yield schemas_1.UuidDateRangeValidation.validateAsync(dateRange);
                const res = yield (0, rewards_1.getErc721RewardsDistributionOneUser)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, dateRange);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/rewards_range/erc20/user', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                querystring: {
                    $ref: 'UuidDateRange'
                }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const dateRange = req.query;
                dateRange.startDate = new Date(dateRange.startDate);
                dateRange.endDate = new Date(dateRange.endDate);
                yield schemas_1.UuidDateRangeValidation.validateAsync(dateRange);
                const res = yield (0, rewards_1.getRewardEventsRangeErc20OneUser)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, dateRange);
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyStatRewardsError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.statRewardsController = statRewardsController;
