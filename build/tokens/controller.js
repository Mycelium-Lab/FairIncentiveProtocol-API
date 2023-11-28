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
exports.tokensPlugin = void 0;
const schemas_1 = require("../schemas");
const service_1 = require("./service");
const errors_1 = require("../errors");
const response_description_1 = require("../response_description");
const nft_storage_1 = require("nft.storage");
const config_1 = require("../config/config");
function tokensPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.tokenResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.getTokens)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyTokensError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
        app.post('/add', {
            preHandler: app.authenticate,
            schema: {
                // body: { $ref: 'AddToken' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.tokenAddResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const token = {
                    name: body.name.value,
                    symbol: body.symbol.value,
                    supply_type: body.supply_type.value,
                    chainid: body.chainid.value,
                    address: body.address.value,
                    max_supply: body.max_supply.value === 'null' ? null : body.max_supply.value,
                    initial_supply: body.initial_supply.value === 'null' ? null : body.initial_supply.value,
                    pausable: body.pausable.value,
                    burnable: body.burnable.value,
                    blacklist: body.blacklist.value,
                    recoverable: body.recoverable.value,
                    verified: body.verified.value,
                    fpmanager: body.fpmanager.value
                };
                yield schemas_1.AddTokenValidation.validateAsync(token);
                const _file = new nft_storage_1.File([yield body.image.toBuffer()], body.image.filename, { type: body.image.mimetype });
                const storage = new nft_storage_1.NFTStorage({ token: config_1.config.NFT_STORAGE_KEY });
                const cid = yield storage.store({
                    image: _file,
                    name: token.symbol,
                    description: token.name
                });
                const image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`;
                token.image = image;
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.addToken)(token, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyTokensError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.tokensPlugin = tokensPlugin;
