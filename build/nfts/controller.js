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
                try {
                    const body = req.body;
                    let logoImage, featuredImage, bannerImage;
                    let nft = {
                        address: body.address.value,
                        name: body.name.value,
                        symbol: body.symbol.value,
                        chainid: body.chainid.value,
                        description: body.description.value === 'null' ? null : body.description.value,
                        links: JSON.parse(body.links.value),
                        beneficiary: body.beneficiary.value === 'null' ? null : body.beneficiary.value,
                        royalties: body.royalties.value
                    };
                    if (!body.logo_image)
                        throw Error('Logo image cannot be null');
                    else
                        logoImage = new nft_storage_1.File([yield body.logo_image.toBuffer()], body.logo_image.filename, { type: body.logo_image.mimetype });
                    if (!body.featured_image)
                        throw Error('Featured image cannot be null');
                    else
                        featuredImage = new nft_storage_1.File([yield body.featured_image.toBuffer()], body.featured_image.filename, { type: body.featured_image.mimetype });
                    if (!body.banner_image)
                        throw Error('Banner image cannot be null');
                    else
                        bannerImage = new nft_storage_1.File([yield body.banner_image.toBuffer()], body.banner_image.filename, { type: body.banner_image.mimetype });
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
                const body = req.body;
                const nft = {
                    address: body.address.value,
                    chainid: body.chainid.value,
                    amount: body.amount.value === 'null' ? null : body.amount.value,
                    name: body.name.value,
                    description: body.description.value === 'null' ? null : body.description.value
                };
                yield schemas_1.AddNFTValidation.validateAsync(nft);
                let _file;
                if (!body.image)
                    throw Error('NFT image cannot be null');
                else
                    _file = new nft_storage_1.File([yield body.image.toBuffer()], body.image.filename, { type: body.image.mimetype });
                const storage = new nft_storage_1.NFTStorage({ token: config_1.config.NFT_STORAGE_KEY });
                const cid = yield storage.store({
                    image: _file,
                    name: (nft === null || nft === void 0 ? void 0 : nft.name) || body.image.filename,
                    description: (nft === null || nft === void 0 ? void 0 : nft.description) || body.image.filename
                });
                const image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`;
                nft.image = image;
                nft.image_json = `https://ipfs.io/ipfs/${cid.url.replace('ipfs://', '')}`;
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
