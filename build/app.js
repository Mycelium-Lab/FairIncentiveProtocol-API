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
const controller_1 = require("./auth/controller");
const jwt_1 = require("./auth/jwt");
const jwt_2 = __importDefault(require("@fastify/jwt"));
const config_1 = require("./config/config");
const schemas_1 = require("./schemas");
const cors_1 = __importDefault(require("@fastify/cors"));
const controller_2 = require("./company/controller");
const controller_3 = require("./tokens/controller");
const controller_4 = require("./users/controller");
const controller_5 = require("./nfts/controller");
const controller_6 = require("./rewards/controller");
function build(opt = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, fastify_1.default)(opt);
        (0, schemas_1.addSchemas)(app);
        app.register(jwt_2.default, {
            secret: config_1.config.SECRET_KEY,
        });
        app.register(jwt_1.jwtPlugin);
        app.register(controller_1.authPlugin, { prefix: '/auth' });
        app.register(controller_2.companyPlugin, { prefix: '/company' });
        app.register(controller_3.tokensPlugin, { prefix: '/tokens' });
        app.register(controller_4.usersPlugin, { prefix: '/users' });
        app.register(controller_5.nftsPlugin, { prefix: '/nfts' });
        app.register(controller_6.rewardsPlugin, { prefix: '/rewards' });
        app.register(cors_1.default, {
            origin: "*",
            methods: ["GET", "POST"]
        });
        app.get('/ping', (req, res) => { res.send('pong'); });
        return app;
    });
}
exports.build = build;
