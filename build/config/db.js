"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const config_1 = require("./config");
const pg = (0, knex_1.default)({
    client: 'pg',
    connection: config_1.config.DB_CONNECTION
});
exports.default = pg;
