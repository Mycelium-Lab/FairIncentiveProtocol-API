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
exports.usersPlugin = void 0;
const schemas_1 = require("../schemas");
const service_1 = require("./service");
const errors_1 = require("../errors");
const response_description_1 = require("../response_description");
const nft_storage_1 = require("nft.storage");
const config_1 = require("../config/config");
function usersPlugin(app, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/', {
            preHandler: app.authenticate,
            schema: {
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.usersResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.getUsers)({ email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyUsersError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        })),
            app.post('/add', {
                preHandler: app.authenticate,
                schema: {
                    // body: { $ref: 'AddUser' },
                    headers: response_description_1.authorizationTokenDescription,
                    response: response_description_1.userAddResponseDescription
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = req.body;
                    let user = {
                        external_id: body.external_id.value,
                        email: body.email.value,
                        wallet: body.wallet.value,
                        notes: body.notes.value === 'null' ? null : body.notes.value,
                        properties: JSON.parse(body.properties.value),
                        stats: JSON.parse(body.stats.value)
                    };
                    yield schemas_1.AddUserValidation.validateAsync(user);
                    if (body.image) {
                        const image = new nft_storage_1.File([yield body.image.toBuffer()], body.image.filename, { type: body.image.mimetype });
                        const storage = new nft_storage_1.NFTStorage({ token: config_1.config.NFT_STORAGE_KEY });
                        const cid = yield storage.store({
                            image: image,
                            name: image.name,
                            description: image.name
                        });
                        const _image = `https://ipfs.io/ipfs/${cid.data.image.host}${cid.data.image.pathname}`;
                        user.image = _image;
                    }
                    const data = req.routeConfig.jwtData;
                    const res = yield (0, service_1.addUser)(user, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? { body: res.body } : { error: res.error });
                }
                catch (error) {
                    console.log(error.message);
                    const prettyError = (0, errors_1.prettyUsersError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            })),
            app.post('/delete', {
                preHandler: app.authenticate,
                schema: {
                    body: { $ref: 'Delete' },
                    headers: response_description_1.authorizationTokenDescription,
                    response: response_description_1.userDeleteResponseDescription
                }
            }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = req.body;
                    yield schemas_1.DeleteValidation.validateAsync(user);
                    const data = req.routeConfig.jwtData;
                    const res = yield (0, service_1.deleteUser)(user, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                    reply
                        .code(res.code)
                        .type('application/json; charset=utf-8')
                        .send('body' in res ? { body: res.body } : { error: res.error });
                }
                catch (error) {
                    console.log(error.message);
                    const prettyError = (0, errors_1.prettyUsersError)(error.message);
                    reply
                        .code(prettyError.code)
                        .type('application/json; charset=utf-8')
                        .send({ error: prettyError.error });
                }
            }));
        app.post('/update', {
            preHandler: app.authenticate,
            schema: {
                body: { $ref: 'UpdateUser' },
                headers: response_description_1.authorizationTokenDescription,
                response: response_description_1.userUpdateResponseDescription
            }
        }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                yield schemas_1.UpdateUserValidation.validateAsync(user);
                const data = req.routeConfig.jwtData;
                const res = yield (0, service_1.updateUser)(user, { email: data === null || data === void 0 ? void 0 : data.email, phone: data === null || data === void 0 ? void 0 : data.phone, company_id: data === null || data === void 0 ? void 0 : data.company_id });
                reply
                    .code(res.code)
                    .type('application/json; charset=utf-8')
                    .send('body' in res ? { body: res.body } : { error: res.error });
            }
            catch (error) {
                console.log(error.message);
                const prettyError = (0, errors_1.prettyUsersError)(error.message);
                reply
                    .code(prettyError.code)
                    .type('application/json; charset=utf-8')
                    .send({ error: prettyError.error });
            }
        }));
    });
}
exports.usersPlugin = usersPlugin;
