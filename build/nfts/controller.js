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
exports.nftsPlugin = void 0;
const schemas_1 = require("../schemas");
const service_1 = require("./service");
const errors_1 = require("../errors");
function nftsPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/collections', {
            preHandler: app.authenticate,
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.getNFTCollections)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyNFTError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.get('/nfts', {
            preHandler: app.authenticate,
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.getNFTs)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error);
                const prettyError = (0, errors_1.prettyNFTError)(error.message);
                reply
                    .code(prettyError.code)
                    .send({ error: prettyError.error });
            }
        })),
            app.post('/add/collection', {
                preHandler: app.authenticate,
                schema: {
                    body: { $ref: 'AddNFTCollection' }
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const nft = req.body;
                    yield schemas_1.AddNFTCollectionValidation.validateAsync(nft);
                    const data = req.routeConfig.jwtData;
                    const res = yield (0, service_1.addNFTCollection)(nft, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? { body: res.body } : { error: res.error });
                }
                catch (error) {
                    console.log(error.message);
                    const prettyError = (0, errors_1.prettyNFTError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            }));
        app.post('/add/nft', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'AddNFT' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const nft = req.body;
                yield schemas_1.AddNFTValidation.validateAsync(nft);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.addNFT)(nft, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error);
                const prettyError = (0, errors_1.prettyNFTError)(error.message);
                reply
                    .code(prettyError.code)
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/delete/nft', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'Delete' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const nft = req.body;
                yield schemas_1.DeleteValidation.validateAsync(nft);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.deleteNFT)(nft, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error);
                const prettyError = (0, errors_1.prettyNFTError)(error.message);
                reply
                    .code(prettyError.code)
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.nftsPlugin = nftsPlugin;
