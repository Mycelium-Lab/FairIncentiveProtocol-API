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
                const file = yield req.file();
                console.log(file.fields.name, file.fields.symbol, file.fields.supply_type, file.fields.chainid, file.fields.address, file.fields.maxSupply, file.fields.initialSupply, file.fields.pausable, file.fields.burnable, file.fields.blacklist, file.fields.recoverable, file.fields.verified, file.fields.fpmanager);
                const token = {
                    name: file.fields.name.value,
                    symbol: file.fields.symbol.value,
                    supply_type: file.fields.supply_type.value,
                    chainid: file.fields.chainid.value,
                    address: file.fields.address.value,
                    max_supply: file.fields.max_supply.value === 'null' ? null : file.fields.max_supply.value,
                    initial_supply: file.fields.initial_supply.value === 'null' ? null : file.fields.initial_supply.value,
                    pausable: file.fields.pausable.value,
                    burnable: file.fields.burnable.value,
                    blacklist: file.fields.blacklist.value,
                    recoverable: file.fields.recoverable.value,
                    verified: file.fields.verified.value,
                    fpmanager: file.fields.fpmanager.value
                };
                yield schemas_1.AddTokenValidation.validateAsync(token);
                const _file = new nft_storage_1.File([yield file.toBuffer()], file.filename, { type: file.mimetype });
                const storage = new nft_storage_1.NFTStorage({ token: config_1.config.NFT_STORAGE_KEY });
                const cid = yield storage.store({
                    image: _file,
                    name: file.filename,
                    description: file.filename
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
