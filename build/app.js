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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const config_1 = require("./config/config");
const schemas_1 = require("./schemas");
const controller_1 = require("./company/controller");
const controller_2 = require("./tokens/controller");
const controller_3 = require("./users/controller");
const controller_4 = require("./nfts/controller");
const controller_5 = require("./rewards/controller");
const controller_6 = require("./auth/controller");
const jwt_2 = require("./auth/jwt");
const controller_7 = require("./public/controller");
function build(opt = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, fastify_1.default)(opt);
        (0, schemas_1.addSchemas)(app);
        app.register(jwt_1.default, {
            secret: config_1.config.SECRET_KEY,
            sign: {
                expiresIn: '1h'
            }
        });
        app.register(jwt_2.jwtPlugin);
        app.register(controller_6.authPlugin, { prefix: '/auth' });
        app.register(controller_1.companyPlugin, { prefix: '/company' });
        app.register(controller_2.tokensPlugin, { prefix: '/tokens' });
        app.register(controller_3.usersPlugin, { prefix: '/users' });
        app.register(controller_4.nftsPlugin, { prefix: '/nfts' });
        app.register(controller_5.rewardsPlugin, { prefix: '/rewards' });
        app.register(controller_7.publicPlugin, { prefix: '/claim' });
        app.register(cors_1.default, {
            origin: "*",
            methods: ["GET", "POST"]
        });
        app.get('/ping', (req, res) => res.send('pong'));
        app.setErrorHandler((error, request, reply) => {
            if (error.statusCode === 400)
                error.name = 'Bad Request';
            error.message =
                error.message.includes(' must')
                    ?
                        error.message.replace('body/', '<').replace(' must', '> must')
                    :
                        error.message;
            const customError = {
                error: {
                    name: error.name || 'Internal Server Error',
                    message: error.message || 'An error occurred',
                },
            };
            reply
                .code(error.statusCode || 500)
                .send(customError)
                .type('application/json; charset=utf-8');
        });
        return app;
    });
}
exports.build = build;
