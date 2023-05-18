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
const controller_1 = require("../company/controller");
const schemas_1 = require("../schemas");
const service_1 = require("./service");
function nftsPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/add/collection', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'AddNFTCollection' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const nft = req.body;
                yield schemas_1.AddNFTCollectionValidation.validateAsync(nft);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.addNFTCollection)(nft, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Something wrong with token');
            }
            catch (error) {
                //TODO: pretty tokens error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.get('/collections', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.getNFTCollections)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(200)
                        .send({ nftCollections: res });
                }
                else
                    throw Error('Something wrong with token');
            }
            catch (error) {
                //TODO: pretty tokens error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.post('/add/nft', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'AddNFT' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const nft = req.body;
                yield schemas_1.AddNFTValidation.validateAsync(nft);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.addNFT)(nft, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Something wrong with token');
            }
            catch (error) {
                console.log(error);
                //TODO: pretty tokens error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.get('/nfts', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })]
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.getNFTs)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(200)
                        .send({ nfts: res });
                }
                else
                    throw Error('Something wrong with token');
            }
            catch (error) {
                //TODO: pretty tokens error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
        app.post('/delete/nft', {
            onRequest: [(req) => __awaiter(this, void 0, void 0, function* () { return yield req.jwtVerify(); })],
            schema: {
                body: { $ref: 'Delete' }
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, controller_1.getToken)(req);
                const nft = req.body;
                yield schemas_1.DeleteValidation.validateAsync(nft);
                if (token) {
                    const data = app.jwt.decode(token);
                    const res = yield (0, service_1.deleteNFT)(nft, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res ? 200 : 500)
                        .send({ message: res ? 'Done' : 'Something went wrong' });
                }
                else
                    throw Error('Something wrong with token');
            }
            catch (error) {
                console.log(error);
                //TODO: pretty tokens error
                reply
                    .code(500)
                    .send({ message: error.message });
            }
        }));
    });
}
exports.nftsPlugin = nftsPlugin;
