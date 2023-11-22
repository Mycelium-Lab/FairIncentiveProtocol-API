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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftsPlugin = void 0;
const schemas_1 = require("../schemas");
const service_1 = require("./service");
const errors_1 = require("../errors");
const response_description_1 = require("../response_description");
const nft_storage_1 = require("nft.storage");
const config_1 = require("../config/config");
function nftsPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/collections', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.nftCollectionsResponseDescription
            }
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
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.nftsResponseDescription
            }
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
            app.get('/nfts/one', {
                preHandler: app.authenticate,
                schema: {
                    headers: response_description_1.authorizationTokenDescription,
                    querystring: {
                        $ref: 'GetOneCollectionNft'
                    }
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = req.routeConfig.jwtData;
                    const getOneCollectionNft = req.query;
                    const res = yield (0, service_1.getNFTsOneCollection)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id }, getOneCollectionNft);
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
                    // body: { $ref: 'AddNFTCollection' },
                    headers: response_description_1.authorizationTokenDescription,
                    response: response_description_1.collectionAddResponseDescription
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                try {
                    // const file: any = await req.file()
                    const parts = req.parts();
                    let logoImage, featuredImage, bannerImage;
                    let nft = {};
                    try {
                        for (var _d = true, parts_1 = __asyncValues(parts), parts_1_1; parts_1_1 = yield parts_1.next(), _a = parts_1_1.done, !_a;) {
                            _c = parts_1_1.value;
                            _d = false;
                            try {
                                const part = _c;
                                if (part.fieldname === 'address') {
                                    nft.address = part.value;
                                }
                                if (part.fieldname === 'name') {
                                    nft.name = part.value;
                                }
                                if (part.fieldname === 'symbol') {
                                    nft.symbol = part.value;
                                }
                                if (part.fieldname === 'chainid') {
                                    nft.chainid = part.value;
                                }
                                if (part.fieldname === 'description') {
                                    nft.description = part.value === 'null' ? null : part.value;
                                }
                                if (part.fieldname === 'links') {
                                    nft.links = JSON.parse(part.value);
                                }
                                if (part.fieldname === 'beneficiary') {
                                    nft.beneficiary = part.value === 'null' ? null : part.value;
                                }
                                if (part.fieldname === 'royalties') {
                                    nft.royalties = part.value;
                                }
                                if (part.fieldname === 'logo_image') {
                                    logoImage = new nft_storage_1.File([yield part.toBuffer()], part.filename, { type: part.mimetype });
                                }
                                if (part.fieldname === 'featured_image') {
                                    featuredImage = new nft_storage_1.File([yield part.toBuffer()], part.filename, { type: part.mimetype });
                                }
                                if (part.fieldname === 'banner_image') {
                                    bannerImage = new nft_storage_1.File([yield part.toBuffer()], part.filename, { type: part.mimetype });
                                }
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = parts_1.return)) yield _b.call(parts_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    yield schemas_1.AddNFTCollectionValidation.validateAsync(nft);
                    const storage = new nft_storage_1.NFTStorage({ token: config_1.config.NFT_STORAGE_KEY });
                    //@ts-ignore
                    const cid = yield storage.storeDirectory([
                        logoImage, featuredImage, bannerImage
                    ]);
                    nft.logo_image = `https://ipfs.io/ipfs/${cid}/${logoImage === null || logoImage === void 0 ? void 0 : logoImage.name}`;
                    nft.featured_image = `https://ipfs.io/ipfs/${cid}/${featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.name}`;
                    nft.banner_image = `https://ipfs.io/ipfs/${cid}/${bannerImage === null || bannerImage === void 0 ? void 0 : bannerImage.name}`;
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
                // body: { $ref: 'AddNFT' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.nftAddResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield req.file();
                const nft = {
                    address: file.fields.address.value,
                    chainid: file.fields.chainid.value,
                    amount: file.fields.amount.value === 'null' ? null : file.fields.amount.value,
                    name: file.fields.name.value,
                    description: file.fields.description.value === 'null' ? null : file.fields.description.value
                };
                yield schemas_1.AddNFTValidation.validateAsync(nft);
                const _file = new nft_storage_1.File([yield file.toBuffer()], file.filename, { type: file.mimetype });
                const storage = new nft_storage_1.NFTStorage({ token: config_1.config.NFT_STORAGE_KEY });
                const cid = yield storage.store({
                    image: _file,
                    name: file.filename,
                    description: file.filename
                });
                const image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`;
                nft.image = image;
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
                body: { $ref: 'Delete' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.nftsDeleteResponseDescription
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
